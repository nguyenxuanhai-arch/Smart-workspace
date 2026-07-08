package com.example.smartworkspace.mappers;

import java.util.List;

import com.example.smartworkspace.dtos.order.OrderItemResponse;
import com.example.smartworkspace.dtos.order.OrderResponse;
import com.example.smartworkspace.entities.Order;
import com.example.smartworkspace.entities.OrderItem;
import com.example.smartworkspace.entities.Payment;
import com.example.smartworkspace.entities.Shipment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderMapper {
    private final PaymentMapper paymentMapper;
    private final ShipmentMapper shipmentMapper;

    public OrderResponse toResponse(
            Order order,
            List<OrderItem> items,
            Payment payment,
            Shipment shipment
    ) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .customerName(order.getUser().getFullName())
                .customerEmail(order.getUser().getEmail())
                .orderCode(order.getOrderCode())
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .shippingAddress(order.getShippingAddress())
                .subtotalAmount(order.getSubtotalAmount())
                .shippingFee(order.getShippingFee())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .note(order.getNote())
                .items(items.stream().map(this::toItemResponse).toList())
                .payment(paymentMapper.toResponse(payment))
                .shipment(shipmentMapper.toResponse(shipment))
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        String productImage = null;
        if (item.getProduct() != null && item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()) {
            productImage = item.getProduct().getImages().stream()
                    .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                    .findFirst()
                    .map(img -> img.getImageUrl())
                    .orElse(item.getProduct().getImages().get(0).getImageUrl());
        }

        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProductName())
                .productSku(item.getProductSku())
                .productImage(productImage)
                .unitPrice(item.getUnitPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .build();
    }
}
