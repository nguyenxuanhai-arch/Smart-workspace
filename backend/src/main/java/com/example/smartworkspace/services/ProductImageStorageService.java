package com.example.smartworkspace.services;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.dtos.upload.ProductImageUploadResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProductImageStorageService {
    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;
    private static final int RANDOM_PART_LENGTH = 8;
    private static final int MAX_BASE_NAME_LENGTH = 80;
    private static final String DEFAULT_BASE_NAME = "product-image";
    private static final String PUBLIC_URL_PREFIX = "/uploads/products/";
    private static final DateTimeFormatter FILE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );
    private static final Map<String, String> CONTENT_TYPE_EXTENSIONS = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    @Value("${app.upload.product-image-dir:uploads/products}")
    private String productImageDir;

    public ProductImageUploadResponse uploadProductImage(MultipartFile file) {
        validateFile(file);

        Path uploadDir = getUploadDir();
        String originalFileName = getOriginalFileName(file);
        String contentType = file.getContentType().toLowerCase(Locale.ROOT);
        String fileName = buildFileName(originalFileName, contentType);
        Path targetPath = uploadDir.resolve(fileName).normalize();

        if (!targetPath.startsWith(uploadDir)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Invalid file name");
        }

        try {
            Files.createDirectories(uploadDir);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetPath);
            }
        } catch (IOException exception) {
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR, "Could not save uploaded file");
        }

        return ProductImageUploadResponse.builder()
                .fileName(fileName)
                .originalFileName(originalFileName)
                .contentType(contentType)
                .size(file.getSize())
                .url(PUBLIC_URL_PREFIX + fileName)
                .build();
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "File is required");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "File size must be less than or equal to 5MB");
        }

        String contentType = file.getContentType();
        if (!StringUtils.hasText(contentType)
                || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Only JPEG, PNG, and WebP images are allowed");
        }
    }

    private Path getUploadDir() {
        return Paths.get(productImageDir).toAbsolutePath().normalize();
    }

    private String getOriginalFileName(MultipartFile file) {
        String originalFileName = file.getOriginalFilename();
        if (!StringUtils.hasText(originalFileName)) {
            return DEFAULT_BASE_NAME;
        }

        String normalizedSeparators = originalFileName.replace('\\', '/');
        String fileName = normalizedSeparators.substring(normalizedSeparators.lastIndexOf('/') + 1);
        String cleanedFileName = StringUtils.cleanPath(fileName);

        if (!StringUtils.hasText(cleanedFileName)) {
            return DEFAULT_BASE_NAME;
        }
        if (cleanedFileName.contains("..")) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Invalid file name");
        }
        return cleanedFileName;
    }

    private String buildFileName(String originalFileName, String contentType) {
        String timestamp = LocalDateTime.now().format(FILE_TIME_FORMATTER);
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, RANDOM_PART_LENGTH);
        return timestamp + "-" + randomPart + "-" + safeBaseName(originalFileName)
                + CONTENT_TYPE_EXTENSIONS.get(contentType);
    }

    private String safeBaseName(String originalFileName) {
        String baseName = removeExtension(originalFileName);
        String normalized = Normalizer.normalize(baseName, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        String safeName = normalized.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9._-]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("(^[-.]+|[-.]+$)", "");

        if (!StringUtils.hasText(safeName)) {
            return DEFAULT_BASE_NAME;
        }
        if (safeName.length() > MAX_BASE_NAME_LENGTH) {
            return safeName.substring(0, MAX_BASE_NAME_LENGTH);
        }
        return safeName;
    }

    private String removeExtension(String fileName) {
        int extensionIndex = fileName.lastIndexOf('.');
        if (extensionIndex <= 0) {
            return fileName;
        }
        return fileName.substring(0, extensionIndex);
    }
}
