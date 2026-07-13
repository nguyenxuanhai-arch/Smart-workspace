package com.example.smartworkspace.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.smartworkspace.dtos.payment.CreatePayOSCheckoutResponse;
import com.example.smartworkspace.entities.Order;
import com.example.smartworkspace.entities.Payment;
import com.example.smartworkspace.entities.User;
import com.example.smartworkspace.enums.OrderStatus;
import com.example.smartworkspace.enums.PaymentStatus;
import com.example.smartworkspace.repositories.OrderRepository;
import com.example.smartworkspace.repositories.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.v2.paymentRequests.PaymentLink;
import vn.payos.model.v2.paymentRequests.PaymentLinkStatus;
import vn.payos.service.blocking.v2.paymentRequests.PaymentRequestsService;

@ExtendWith(MockitoExtension.class)
class PayOSPaymentServiceTest {

    @Mock
    private PayOS payOS;

    @Mock
    private PaymentRequestsService paymentRequestsService;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PaymentRepository paymentRepository;

    private PayOSPaymentService service;

    @BeforeEach
    void setUp() {
        service = new PayOSPaymentService(payOS, orderRepository, paymentRepository);
    }

    @Test
    void createsCheckoutWithCurrentOriginCallbackUrls() {
        Order order = order(7L, 42L);
        Payment payment = payment(order);
        when(orderRepository.findById(7L)).thenReturn(Optional.of(order));
        when(paymentRepository.findByOrderId(7L)).thenReturn(Optional.of(payment));
        when(payOS.paymentRequests()).thenReturn(paymentRequestsService);
        when(paymentRequestsService.create(any(CreatePaymentLinkRequest.class)))
            .thenReturn(createdLink("new-link", "https://pay.payos.vn/web/new"));

        service.createCheckout(7L, 42L, "https://85.211.242.22");

        ArgumentCaptor<CreatePaymentLinkRequest> requestCaptor =
            ArgumentCaptor.forClass(CreatePaymentLinkRequest.class);
        verify(paymentRequestsService).create(requestCaptor.capture());
        assertThat(requestCaptor.getValue().getReturnUrl())
            .isEqualTo("https://85.211.242.22/payment/payos/return");
        assertThat(requestCaptor.getValue().getCancelUrl())
            .isEqualTo("https://85.211.242.22/payment/payos/cancel");
        assertThat(payment.getCallbackOrigin()).isEqualTo("https://85.211.242.22");
        verify(paymentRepository).save(payment);
    }

    @Test
    void reusesUnexpiredCheckoutOnlyWhenCallbackOriginMatches() {
        Order order = order(7L, 42L);
        Payment payment = payment(order);
        payment.setProviderOrderCode(123456L);
        payment.setPaymentLinkId("existing-link");
        payment.setCheckoutUrl("https://pay.payos.vn/web/existing");
        payment.setCallbackOrigin("https://85.211.242.22");
        payment.setExpiredAt(LocalDateTime.now().plusMinutes(10));
        when(orderRepository.findById(7L)).thenReturn(Optional.of(order));
        when(paymentRepository.findByOrderId(7L)).thenReturn(Optional.of(payment));

        CreatePayOSCheckoutResponse response =
            service.createCheckout(7L, 42L, "https://85.211.242.22");

        assertThat(response.getCheckoutUrl()).isEqualTo("https://pay.payos.vn/web/existing");
        verifyNoInteractions(payOS);
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    void cancelsAndReplacesLinkCreatedForDifferentOrigin() {
        Order order = order(7L, 42L);
        Payment payment = payment(order);
        payment.setProviderOrderCode(123456L);
        payment.setPaymentLinkId("old-link");
        payment.setCheckoutUrl("https://pay.payos.vn/web/old");
        payment.setCallbackOrigin("http://old.example");
        payment.setExpiredAt(LocalDateTime.now().plusMinutes(10));
        when(orderRepository.findById(7L)).thenReturn(Optional.of(order));
        when(paymentRepository.findByOrderId(7L)).thenReturn(Optional.of(payment));
        when(payOS.paymentRequests()).thenReturn(paymentRequestsService);
        when(paymentRequestsService.get(123456L)).thenReturn(
            new PaymentLink(
                "old-link",
                123456L,
                250000L,
                0L,
                250000L,
                PaymentLinkStatus.PENDING,
                "2026-07-13T00:00:00Z",
                List.of(),
                null,
                null
            )
        );
        when(paymentRequestsService.create(any(CreatePaymentLinkRequest.class)))
            .thenReturn(createdLink("new-link", "https://pay.payos.vn/web/new"));

        service.createCheckout(7L, 42L, "https://85.211.242.22");

        verify(paymentRequestsService).cancel(
            123456L,
            "Replace checkout link with current callback origin"
        );
        assertThat(payment.getPaymentLinkId()).isEqualTo("new-link");
        assertThat(payment.getCallbackOrigin()).isEqualTo("https://85.211.242.22");
    }

    private Order order(Long orderId, Long userId) {
        User user = new User();
        user.setId(userId);

        Order order = new Order();
        order.setId(orderId);
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setReceiverName("Test User");
        order.setReceiverPhone("0900000000");
        order.setTotalAmount(BigDecimal.valueOf(250000));
        return order;
    }

    private Payment payment(Order order) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentStatus(PaymentStatus.UNPAID);
        return payment;
    }

    private CreatePaymentLinkResponse createdLink(String paymentLinkId, String checkoutUrl) {
        return new CreatePaymentLinkResponse(
            "9704",
            "0123456789",
            "SMART WORKSPACE",
            250000L,
            "DH123456",
            123456L,
            "VND",
            paymentLinkId,
            PaymentLinkStatus.PENDING,
            1783900800L,
            checkoutUrl,
            "qr"
        );
    }
}
