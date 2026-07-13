package com.example.smartworkspace.services;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Objects;

import com.example.smartworkspace.dtos.payment.CreatePayOSCheckoutResponse;
import com.example.smartworkspace.entities.Order;
import com.example.smartworkspace.entities.Payment;
import com.example.smartworkspace.enums.OrderStatus;
import com.example.smartworkspace.enums.PaymentMethod;
import com.example.smartworkspace.enums.PaymentStatus;
import com.example.smartworkspace.repositories.OrderRepository;
import com.example.smartworkspace.repositories.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.payos.PayOS;
import vn.payos.exception.PayOSException;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.v2.paymentRequests.PaymentLink;
import vn.payos.model.v2.paymentRequests.PaymentLinkStatus;

@Service
@RequiredArgsConstructor
public class PayOSPaymentService {

    private final PayOS payOS;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public CreatePayOSCheckoutResponse createCheckout(Long orderId, Long currentUserId, String callbackOrigin) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (!order.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Không có quyền thanh toán đơn hàng này");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Đơn hàng không ở trạng thái PENDING");
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi thanh toán"));

        if (payment.getPaymentStatus() == PaymentStatus.PAID) {
            throw new IllegalStateException("Đơn hàng đã được thanh toán");
        }

        LocalDateTime now = LocalDateTime.now();
        if (canReuseCheckoutLink(payment, callbackOrigin, now)) {
            return new CreatePayOSCheckoutResponse(
                order.getId(),
                payment.getProviderOrderCode(),
                payment.getPaymentLinkId(),
                "PENDING",
                payment.getCheckoutUrl(),
                null,
                payment.getExpiredAt() == null ? null : payment.getExpiredAt().atZone(java.time.ZoneId.systemDefault()).toEpochSecond()
            );
        }

        invalidateExistingCheckoutLink(payment, now);

        long providerOrderCode = (System.currentTimeMillis() / 1000 % 1000000) * 1000 + (order.getId() % 1000);
        long amount = order.getTotalAmount().longValueExact();
        long expiredAt = Instant.now().plusSeconds(15 * 60).getEpochSecond();

        CreatePaymentLinkRequest request = CreatePaymentLinkRequest.builder()
            .orderCode(providerOrderCode)
            .amount(amount)
            .description(buildPayOSDescription(providerOrderCode))
            .buyerName(order.getReceiverName())
            .buyerPhone(order.getReceiverPhone())
            .returnUrl(callbackOrigin + "/payment/payos/return")
            .cancelUrl(callbackOrigin + "/payment/payos/cancel")
            .expiredAt(expiredAt)
            .build();

        try {
            CreatePaymentLinkResponse response = payOS.paymentRequests().create(request);

            payment.setPaymentMethod(PaymentMethod.PAYOS);
            payment.setProviderOrderCode(providerOrderCode);
            payment.setPaymentLinkId(response.getPaymentLinkId());
            payment.setCheckoutUrl(response.getCheckoutUrl());
            payment.setCallbackOrigin(callbackOrigin);
            payment.setExpiredAt(Instant.ofEpochSecond(expiredAt).atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
            paymentRepository.save(payment);

            return new CreatePayOSCheckoutResponse(
                order.getId(),
                providerOrderCode,
                response.getPaymentLinkId(),
                response.getStatus().getValue(),
                response.getCheckoutUrl(),
                response.getQrCode(),
                null // Expired at might not be easily parsable if string
            );
        } catch (Exception ex) {
            throw new RuntimeException("Không thể tạo link thanh toán payOS", ex);
        }
    }

    private boolean canReuseCheckoutLink(Payment payment, String callbackOrigin, LocalDateTime now) {
        return payment.getPaymentLinkId() != null
            && payment.getCheckoutUrl() != null
            && Objects.equals(payment.getCallbackOrigin(), callbackOrigin)
            && payment.getExpiredAt() != null
            && payment.getExpiredAt().isAfter(now);
    }

    private void invalidateExistingCheckoutLink(Payment payment, LocalDateTime now) {
        if (payment.getProviderOrderCode() == null || payment.getPaymentLinkId() == null) {
            return;
        }

        if (payment.getExpiredAt() != null && !payment.getExpiredAt().isAfter(now)) {
            return;
        }

        try {
            PaymentLink existingLink = payOS.paymentRequests().get(payment.getProviderOrderCode());
            PaymentLinkStatus status = existingLink.getStatus();

            if (PaymentLinkStatus.PAID.equals(status)) {
                throw new IllegalStateException("Giao dịch PayOS đã được thanh toán");
            }

            if (PaymentLinkStatus.PENDING.equals(status)
                    || PaymentLinkStatus.PROCESSING.equals(status)
                    || PaymentLinkStatus.UNDERPAID.equals(status)) {
                payOS.paymentRequests().cancel(
                    payment.getProviderOrderCode(),
                    "Replace checkout link with current callback origin"
                );
            }
        } catch (IllegalStateException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Không thể làm mới link thanh toán PayOS", ex);
        }
    }

    @Transactional
    public String syncPayment(Long orderCode, Long currentUserId) {
        try {
            vn.payos.model.v2.paymentRequests.PaymentLink paymentData = payOS.paymentRequests().get(orderCode);
            
            Payment payment = paymentRepository.findByProviderOrderCodeForUpdate(orderCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thanh toán với orderCode: " + orderCode));
            
            if (!payment.getOrder().getUser().getId().equals(currentUserId)) {
                throw new RuntimeException("Không có quyền truy cập đơn hàng này");
            }

            long expectedAmount = payment.getOrder().getTotalAmount().longValueExact();
            if (expectedAmount != paymentData.getAmount()) {
                throw new RuntimeException("Sai số tiền thanh toán: expected=" + expectedAmount + ", actual=" + paymentData.getAmount());
            }

            if (vn.payos.model.v2.paymentRequests.PaymentLinkStatus.PAID.equals(paymentData.getStatus())) {
                if (payment.getPaymentStatus() != PaymentStatus.PAID) {
                    payment.setPaymentStatus(PaymentStatus.PAID);
                    payment.setPaidAt(java.time.LocalDateTime.now());
                    payment.setTransactionCode(paymentData.getId());
                    paymentRepository.save(payment);

                    Order order = payment.getOrder();
                    if (order.getStatus() == OrderStatus.PENDING) {
                        order.setStatus(OrderStatus.CONFIRMED);
                        orderRepository.save(order);
                    }
                }
            } else if (vn.payos.model.v2.paymentRequests.PaymentLinkStatus.CANCELLED.equals(paymentData.getStatus())) {
                if (payment.getPaymentStatus() != PaymentStatus.CANCELLED && payment.getPaymentStatus() != PaymentStatus.PAID) {
                    payment.setPaymentStatus(PaymentStatus.CANCELLED);
                    paymentRepository.save(payment);

                    Order order = payment.getOrder();
                    if (order.getStatus() == OrderStatus.PENDING) {
                        order.setStatus(OrderStatus.CANCELLED);
                        orderRepository.save(order);
                    }
                }
            }
            
            return paymentData.getStatus().getValue();
        } catch (Exception ex) {
            throw new RuntimeException("Lỗi khi đồng bộ thanh toán từ PayOS", ex);
        }
    }

    private String buildPayOSDescription(long orderCode) {
        String description = "DH" + orderCode;
        if (description.length() > 25) {
            description = description.substring(0, 25);
        }
        return description;
    }
}
