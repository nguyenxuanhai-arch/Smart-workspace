package com.example.smartworkspace.controllers;

import java.util.List;

import com.example.smartworkspace.commons.ApiResponse;
import com.example.smartworkspace.dtos.order.BuyNowOrderRequest;
import com.example.smartworkspace.dtos.order.OrderRequest;
import com.example.smartworkspace.dtos.order.OrderResponse;
import com.example.smartworkspace.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
        return ApiResponse.success("Create order successfully", orderService.createOrderFromCart(request));
    }

    @PostMapping("/buy-now")
    public ApiResponse<OrderResponse> createBuyNowOrder(@Valid @RequestBody BuyNowOrderRequest request) {
        return ApiResponse.success("Create buy-now order successfully", orderService.createBuyNowOrder(request));
    }

    @GetMapping("/my")
    public ApiResponse<List<OrderResponse>> getMyOrders() {
        return ApiResponse.success(orderService.getMyOrders());
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getOrder(@PathVariable Long id) {
        return ApiResponse.success(orderService.getMyOrderDetail(id));
    }
}
