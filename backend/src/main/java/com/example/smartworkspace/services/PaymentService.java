package com.example.smartworkspace.services;

import java.time.LocalDateTime;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.dtos.payment.PaymentRequest;
import com.example.smartworkspace.dtos.payment.PaymentResponse;
import com.example.smartworkspace.dtos.payment.PaymentStatusUpdateRequest;
import com.example.smartworkspace.entities.Order;
import com.example.smartworkspace.entities.Payment;
import com.example.smartworkspace.enums.PaymentMethod;
import com.example.smartworkspace.enums.PaymentStatus;
import com.example.smartworkspace.mappers.PaymentMapper;
import com.example.smartworkspace.repositories.OrderRepository;
import com.example.smartworkspace.repositories.PaymentRepository;
import com.example.smartworkspace.securities.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PaymentMapper paymentMapper;

    @Transactional
    public PaymentResponse createMockPayment(Long orderId, PaymentRequest request) {
        Long userId = getCurrentUserId();
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseGet(() -> createPayment(order));
        if (payment.getPaymentStatus() == PaymentStatus.PAID) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Paid order cannot change payment method");
        }

        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus(PaymentStatus.UNPAID);
        payment.setAmount(order.getTotalAmount());
        payment.setTransactionCode(generateTransactionCode(request.getPaymentMethod(), order.getId()));
        payment.setPaidAt(null);
        return paymentMapper.toResponse(paymentRepository.save(payment));
    }

    @Transactional(readOnly = true)
    public java.util.List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public java.util.List<PaymentResponse> getMyPayments() {
        Long userId = getCurrentUserId();
        return paymentRepository.findByOrder_User_Id(userId).stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    @Transactional
    public PaymentResponse updatePaymentStatus(Long id, PaymentStatusUpdateRequest request) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        PaymentStatus paymentStatus = request.getPaymentStatus();
        payment.setPaymentStatus(paymentStatus);

        if (paymentStatus == PaymentStatus.PAID) {
            if (payment.getPaidAt() == null) {
                payment.setPaidAt(LocalDateTime.now());
            }
            if (payment.getTransactionCode() == null) {
                payment.setTransactionCode(generateTransactionCode(payment.getPaymentMethod(), payment.getOrder().getId()));
            }
        } else if (paymentStatus == PaymentStatus.UNPAID || paymentStatus == PaymentStatus.FAILED) {
            payment.setPaidAt(null);
        }

        return paymentMapper.toResponse(paymentRepository.save(payment));
    }

    private Payment createPayment(Order order) {
        Payment payment = new Payment();
        payment.setOrder(order);
        return payment;
    }

    private String generateTransactionCode(PaymentMethod paymentMethod, Long orderId) {
        if (paymentMethod == PaymentMethod.COD) {
            return null;
        }
        return paymentMethod.name() + "-" + orderId + "-" + System.currentTimeMillis();
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return userDetails.getUser().getId();
    }
}
