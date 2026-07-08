package com.example.smartworkspace.dtos.banner;

import java.time.LocalDateTime;

import com.example.smartworkspace.enums.CommonStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BannerRequest {
    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 500)
    private String imageUrl;

    @Size(max = 500)
    private String linkUrl;

    @NotBlank
    @Size(max = 100)
    private String position;

    @NotNull
    @Min(0)
    private Integer sortOrder;

    @NotNull
    private LocalDateTime startDate;

    @NotNull
    private LocalDateTime endDate;

    @NotNull
    private CommonStatus status;
}
