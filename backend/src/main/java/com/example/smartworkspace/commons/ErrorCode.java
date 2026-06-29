package com.example.smartworkspace.commons;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    INVALID_REQUEST("Invalid request", HttpStatus.BAD_REQUEST),
    VALIDATION_ERROR("Validation failed", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED("Unauthorized", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("Forbidden", HttpStatus.FORBIDDEN),
    INVALID_REFRESH_TOKEN("Invalid refresh token", HttpStatus.UNAUTHORIZED),

    USER_NOT_FOUND("User not found", HttpStatus.NOT_FOUND),
    ROLE_NOT_FOUND("Role not found", HttpStatus.NOT_FOUND),
    ADDRESS_NOT_FOUND("Address not found", HttpStatus.NOT_FOUND),
    EMAIL_ALREADY_EXISTS("Email already exists", HttpStatus.CONFLICT),
    PHONE_ALREADY_EXISTS("Phone already exists", HttpStatus.CONFLICT),

    CATEGORY_NOT_FOUND("Category not found", HttpStatus.NOT_FOUND),
    PRODUCT_NOT_FOUND("Product not found", HttpStatus.NOT_FOUND),
    CATEGORY_SLUG_ALREADY_EXISTS("Category slug already exists", HttpStatus.CONFLICT),
    PRODUCT_SLUG_ALREADY_EXISTS("Product slug already exists", HttpStatus.CONFLICT),
    PRODUCT_SKU_ALREADY_EXISTS("Product SKU already exists", HttpStatus.CONFLICT),

    CART_NOT_FOUND("Cart not found", HttpStatus.NOT_FOUND),
    CART_ITEM_NOT_FOUND("Cart item not found", HttpStatus.NOT_FOUND),
    ORDER_NOT_FOUND("Order not found", HttpStatus.NOT_FOUND),
    PAYMENT_NOT_FOUND("Payment not found", HttpStatus.NOT_FOUND),
    SHIPMENT_NOT_FOUND("Shipment not found", HttpStatus.NOT_FOUND),

    REVIEW_NOT_FOUND("Review not found", HttpStatus.NOT_FOUND),
    COMMENT_NOT_FOUND("Comment not found", HttpStatus.NOT_FOUND),
    DUPLICATE_REVIEW("You already reviewed this product", HttpStatus.CONFLICT),

    FEEDBACK_NOT_FOUND("Feedback not found", HttpStatus.NOT_FOUND),
    POLICY_NOT_FOUND("Policy not found", HttpStatus.NOT_FOUND),
    STORE_LOCATION_NOT_FOUND("Store location not found", HttpStatus.NOT_FOUND),

    OUT_OF_STOCK("Product is out of stock", HttpStatus.BAD_REQUEST),
    INTERNAL_SERVER_ERROR("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String message;
    private final HttpStatus status;
}
