package com.example.smartworkspace.mappers;

import java.math.BigDecimal;
import java.util.List;

import com.example.smartworkspace.dtos.cart.CartItemResponse;
import com.example.smartworkspace.dtos.cart.CartResponse;
import com.example.smartworkspace.entities.Cart;
import com.example.smartworkspace.entities.CartItem;
import com.example.smartworkspace.entities.ProductImage;
import com.example.smartworkspace.repositories.ProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CartMapper {
    private final ProductImageRepository productImageRepository;

    public CartResponse toResponse(Cart cart, List<CartItem> items) {
        List<CartItemResponse> itemResponses = items.stream()
                .map(this::toItemResponse)
                .toList();
        BigDecimal totalAmount = itemResponses.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int totalItems = itemResponses.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        return CartResponse.builder()
                .id(cart.getId())
                .status(cart.getStatus())
                .items(itemResponses)
                .totalItems(totalItems)
                .totalAmount(totalAmount)
                .build();
    }

    private CartItemResponse toItemResponse(CartItem item) {
        List<ProductImage> images = productImageRepository.findByProductIdOrderBySortOrderAsc(item.getProduct().getId());
        String imageUrl = images.stream()
                .filter(ProductImage::getIsPrimary)
                .findFirst()
                .or(() -> images.stream().findFirst())
                .map(ProductImage::getImageUrl)
                .orElse(null);
        BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productSlug(item.getProduct().getSlug())
                .productImageUrl(imageUrl)
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(subtotal)
                .build();
    }
}
