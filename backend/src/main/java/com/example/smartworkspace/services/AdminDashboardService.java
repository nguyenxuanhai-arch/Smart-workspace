package com.example.smartworkspace.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.example.smartworkspace.dtos.dashboard.AdminDashboardResponse;
import com.example.smartworkspace.dtos.dashboard.RevenueSeriesPointResponse;
import com.example.smartworkspace.enums.FeedbackStatus;
import com.example.smartworkspace.enums.OrderStatus;
import com.example.smartworkspace.entities.Order;
import com.example.smartworkspace.repositories.FeedbackRepository;
import com.example.smartworkspace.repositories.OrderItemRepository;
import com.example.smartworkspace.repositories.OrderRepository;
import com.example.smartworkspace.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
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
                .revenueSeries(getRevenueSeries())
                .topProducts(orderItemRepository.findTopProductsByOrderStatus(OrderStatus.COMPLETED, PageRequest.of(0, 5)))
                .build();
    }

    private List<RevenueSeriesPointResponse> getRevenueSeries() {
        LocalDate startDate = LocalDate.now().minusDays(6);
        Map<LocalDate, RevenueBucket> buckets = new LinkedHashMap<>();
        for (int i = 0; i < 7; i++) {
            buckets.put(startDate.plusDays(i), new RevenueBucket());
        }

        orderRepository.findByStatusAndCreatedAtGreaterThanEqualOrderByCreatedAtAsc(
                OrderStatus.COMPLETED,
                startDate.atStartOfDay()
        ).forEach(order -> {
            LocalDate date = order.getCreatedAt().toLocalDate();
            RevenueBucket bucket = buckets.get(date);
            if (bucket != null) {
                bucket.revenue = bucket.revenue.add(order.getTotalAmount());
                bucket.orderCount++;
            }
        });

        return buckets.entrySet().stream()
                .map(entry -> RevenueSeriesPointResponse.builder()
                        .date(entry.getKey())
                        .revenue(entry.getValue().revenue)
                        .orderCount(entry.getValue().orderCount)
                        .build())
                .toList();
    }

    private static class RevenueBucket {
        private BigDecimal revenue = BigDecimal.ZERO;
        private long orderCount;
    }
}
