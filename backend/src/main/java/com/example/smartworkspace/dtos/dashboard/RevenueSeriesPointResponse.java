package com.example.smartworkspace.dtos.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueSeriesPointResponse {
    private LocalDate date;
    private BigDecimal revenue;
    private long orderCount;
}
