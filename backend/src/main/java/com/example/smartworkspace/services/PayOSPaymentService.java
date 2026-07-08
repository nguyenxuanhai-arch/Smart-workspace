package com.example.smartworkspace.services;

import java.time.Instant;

import com.example.smartworkspace.configs.AppUrlProperties;
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

@Service
@RequiredArgsConstructor
public class PayOSPaymentService {

    private final PayOS payOS;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final AppUrlProperties appUrlProperties;

    @Transactional
    public CreatePayOSCheckoutResponse createCheckout(Long orderId, Long currentUserId) {
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

        if (payment.getPaymentLinkId() != null && payment.getCheckoutUrl() != null) {
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

        long providerOrderCode = order.getId();
        long amount = order.getTotalAmount().longValueExact();
        long expiredAt = Instant.now().plusSeconds(15 * 60).getEpochSecond();

        CreatePaymentLinkRequest request = CreatePaymentLinkRequest.builder()
            .orderCode(providerOrderCode)
            .amount(amount)
            .description(buildPayOSDescription(providerOrderCode))
            .buyerName(order.getReceiverName())
            .buyerPhone(order.getReceiverPhone())
            .returnUrl(appUrlProperties.getFrontendUrl() + "/payment/payos/return")
            .cancelUrl(appUrlProperties.getFrontendUrl() + "/payment/payos/cancel")
            .expiredAt(expiredAt)
            .build();

        try {
            CreatePaymentLinkResponse response = payOS.paymentRequests().create(request);

            payment.setPaymentMethod(PaymentMethod.PAYOS);
            payment.setProviderOrderCode(providerOrderCode);
            payment.setPaymentLinkId(response.getPaymentLinkId());
            payment.setCheckoutUrl(response.getCheckoutUrl());
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

    private String buildPayOSDescription(long orderCode) {
        String description = "SW" + Long.toString(orderCode, 36).toUpperCase();
        if (description.length() > 9) {
            throw new IllegalArgumentException("Mô tả payOS vượt quá 9 ký tự");
        }
        return description;
    }
}
