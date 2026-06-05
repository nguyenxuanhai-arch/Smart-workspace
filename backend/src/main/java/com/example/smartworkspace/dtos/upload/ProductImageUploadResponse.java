package com.example.smartworkspace.dtos.upload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageUploadResponse {
    private String fileName;
    private String originalFileName;
    private String contentType;
    private Long size;
    private String url;
}
