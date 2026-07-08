package com.example.smartworkspace.services;

import java.util.List;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.commons.PageResponse;
import com.example.smartworkspace.dtos.review.ProductReviewRequest;
import com.example.smartworkspace.dtos.review.ProductReviewResponse;
import com.example.smartworkspace.dtos.review.ReviewStatusUpdateRequest;
import com.example.smartworkspace.entities.Product;
import com.example.smartworkspace.entities.ProductReview;
import com.example.smartworkspace.entities.User;
import com.example.smartworkspace.enums.ProductStatus;
import com.example.smartworkspace.enums.VisibilityStatus;
import com.example.smartworkspace.mappers.ProductReviewMapper;
import com.example.smartworkspace.repositories.ProductRepository;
import com.example.smartworkspace.repositories.ProductReviewRepository;
import com.example.smartworkspace.repositories.UserRepository;
import com.example.smartworkspace.securities.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductReviewService {
    private final ProductReviewRepository productReviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductReviewMapper productReviewMapper;

    @Transactional(readOnly = true)
    public List<ProductReviewResponse> getProductReviews(Long productId) {
        ensureActiveProduct(productId);
        return productReviewRepository.findByProductIdAndStatusOrderByCreatedAtDesc(productId, VisibilityStatus.VISIBLE)
                .stream()
                .map(productReviewMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductReviewResponse> getReviewsForAdmin(
            String search,
            VisibilityStatus status,
            Long productId,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.max(size, 1),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return PageResponse.from(productReviewRepository
                .findAdminReviews(normalize(search), status, productId, pageable)
                .map(productReviewMapper::toResponse));
    }

    @Transactional
    public ProductReviewResponse createReview(Long productId, ProductReviewRequest request) {
        Long userId = getCurrentUserId();
        Product product = ensureActiveProduct(productId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (productReviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new AppException(ErrorCode.DUPLICATE_REVIEW);
        }

        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(request.getRating());
        review.setContent(trim(request.getContent()));
        review.setStatus(VisibilityStatus.VISIBLE);
        return productReviewMapper.toResponse(productReviewRepository.save(review));
    }

    @Transactional
    public ProductReviewResponse updateReviewStatus(Long id, ReviewStatusUpdateRequest request) {
        ProductReview review = productReviewRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        review.setStatus(request.getStatus());
        return productReviewMapper.toResponse(productReviewRepository.save(review));
    }

    private Product ensureActiveProduct(Long productId) {
        return productRepository.findById(productId)
                .filter(product -> product.getStatus() == ProductStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return userDetails.getUser().getId();
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }

    private String normalize(String value) {
        String trimmed = trim(value);
        return trimmed == null || trimmed.isEmpty() ? null : trimmed;
    }
}
