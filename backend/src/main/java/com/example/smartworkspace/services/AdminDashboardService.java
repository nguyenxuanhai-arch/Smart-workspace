package com.example.smartworkspace.services;

import java.math.BigDecimal;

import com.example.smartworkspace.dtos.dashboard.AdminDashboardResponse;
import com.example.smartworkspace.enums.FeedbackStatus;
import com.example.smartworkspace.enums.OrderStatus;
import com.example.smartworkspace.repositories.FeedbackRepository;
import com.example.smartworkspace.repositories.OrderRepository;
import com.example.smartworkspace.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final FeedbackRepository feedbackRepository;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        BigDecimal totalRevenue = orderRepository.sumTotalAmountByStatus(OrderStatus.COMPLETED);
        return AdminDashboardResponse.builder()
                .totalProducts(productRepository.count())
                .totalOrders(orderRepository.count())
                .totalRevenue(totalRevenue == null ? BigDecimal.ZERO : totalRevenue)
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING))
                .newFeedbacks(feedbackRepository.countByStatus(FeedbackStatus.NEW))
                .build();
    }
}
