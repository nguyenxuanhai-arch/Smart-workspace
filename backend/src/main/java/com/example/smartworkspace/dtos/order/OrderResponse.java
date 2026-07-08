package com.example.smartworkspace.dtos.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.smartworkspace.dtos.payment.PaymentResponse;
import com.example.smartworkspace.dtos.shipment.ShipmentResponse;
import com.example.smartworkspace.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long userId;
    private String customerName;
    private String customerEmail;
    private String orderCode;
    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private BigDecimal subtotalAmount;
    private BigDecimal shippingFee;
    private com.example.smartworkspace.enums.ShippingMethod shippingMethod;
    private String voucherCode;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private String note;
    private List<OrderItemResponse> items;
    private PaymentResponse payment;
    private ShipmentResponse shipment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
