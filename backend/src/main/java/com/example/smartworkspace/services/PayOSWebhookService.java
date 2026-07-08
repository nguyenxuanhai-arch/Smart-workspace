package com.example.smartworkspace.services;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.example.smartworkspace.entities.Order;
import com.example.smartworkspace.entities.Payment;
import com.example.smartworkspace.enums.OrderStatus;
import com.example.smartworkspace.enums.PaymentStatus;
import com.example.smartworkspace.repositories.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.payos.PayOS;
import vn.payos.exception.PayOSException;
import vn.payos.model.webhooks.Webhook;
import vn.payos.model.webhooks.WebhookData;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayOSWebhookService {

    private static final DateTimeFormatter PAYOS_DATE_TIME =
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final PayOS payOS;
    private final PaymentRepository paymentRepository;

    public void handle(Webhook webhook) {
        final WebhookData data;

        try {
            data = payOS.webhooks().verify(webhook);
        } catch (Exception ex) {
            log.warn("Từ chối webhook payOS do signature không hợp lệ");
            throw new RuntimeException("Webhook payOS không hợp lệ", ex);
        }

        processVerifiedWebhook(data);
    }

    @Transactional
    protected void processVerifiedWebhook(WebhookData data) {
        if (!"00".equals(data.getCode())) {
            log.info("Bỏ qua webhook payOS code={}", data.getCode());
            return;
        }

        Payment payment = paymentRepository
            .findByProviderOrderCodeForUpdate(data.getOrderCode())
            .orElse(null);

        if (payment == null) {
            log.info("Webhook payOS hợp lệ nhưng không khớp orderCode={}", data.getOrderCode());
            return;
        }

        if (payment.getPaymentStatus() == PaymentStatus.PAID) {
            log.info("Webhook payOS đã được xử lý, orderCode={}", data.getOrderCode());
            return;
        }

        long expectedAmount = payment.getOrder().getTotalAmount().longValueExact();
        if (data.getAmount() != expectedAmount) {
            throw new RuntimeException(
                "Sai số tiền: expected=" + expectedAmount + ", actual=" + data.getAmount()
            );
        }

        if (payment.getPaymentLinkId() != null
            && !payment.getPaymentLinkId().equals(data.getPaymentLinkId())) {
            throw new RuntimeException("paymentLinkId không khớp");
        }

        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.setTransactionCode(data.getReference());
        payment.setProviderReference(data.getReference());
        payment.setPaymentLinkId(data.getPaymentLinkId());
        payment.setPaidAt(LocalDateTime.parse(
            data.getTransactionDateTime(),
            PAYOS_DATE_TIME
        ));

        Order order = payment.getOrder();
        if (order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.CONFIRMED);
        }

        paymentRepository.save(payment);
    }
}
