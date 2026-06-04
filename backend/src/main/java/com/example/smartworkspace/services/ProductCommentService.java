package com.example.smartworkspace.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.dtos.comment.CommentStatusUpdateRequest;
import com.example.smartworkspace.dtos.comment.ProductCommentRequest;
import com.example.smartworkspace.dtos.comment.ProductCommentResponse;
import com.example.smartworkspace.entities.Product;
import com.example.smartworkspace.entities.ProductComment;
import com.example.smartworkspace.entities.User;
import com.example.smartworkspace.enums.ProductStatus;
import com.example.smartworkspace.enums.VisibilityStatus;
import com.example.smartworkspace.mappers.ProductCommentMapper;
import com.example.smartworkspace.repositories.ProductCommentRepository;
import com.example.smartworkspace.repositories.ProductRepository;
import com.example.smartworkspace.repositories.UserRepository;
import com.example.smartworkspace.securities.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductCommentService {
    private final ProductCommentRepository productCommentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductCommentMapper productCommentMapper;

    @Transactional(readOnly = true)
    public List<ProductCommentResponse> getProductComments(Long productId) {
        ensureActiveProduct(productId);
        List<ProductComment> comments = productCommentRepository
                .findByProductIdAndStatusOrderByCreatedAtAsc(productId, VisibilityStatus.VISIBLE);
        Map<Long, List<ProductComment>> commentsByParentId = comments.stream()
                .filter(comment -> comment.getParent() != null)
                .collect(Collectors.groupingBy(comment -> comment.getParent().getId()));

        return comments.stream()
                .filter(comment -> comment.getParent() == null)
                .map(comment -> toResponseTree(comment, commentsByParentId))
                .toList();
    }

    @Transactional
    public ProductCommentResponse createComment(Long productId, ProductCommentRequest request) {
        Long userId = getCurrentUserId();
        Product product = ensureActiveProduct(productId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        ProductComment parent = resolveParent(productId, request.getParentId());

        ProductComment comment = new ProductComment();
        comment.setProduct(product);
        comment.setUser(user);
        comment.setParent(parent);
        comment.setContent(trim(request.getContent()));
        comment.setStatus(VisibilityStatus.VISIBLE);
        return productCommentMapper.toResponse(productCommentRepository.save(comment), List.of());
    }

    @Transactional
    public ProductCommentResponse updateCommentStatus(Long id, CommentStatusUpdateRequest request) {
        ProductComment comment = productCommentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
        comment.setStatus(request.getStatus());
        return productCommentMapper.toResponse(productCommentRepository.save(comment), List.of());
    }

    private ProductCommentResponse toResponseTree(
            ProductComment comment,
            Map<Long, List<ProductComment>> commentsByParentId
    ) {
        List<ProductCommentResponse> replies = commentsByParentId
                .getOrDefault(comment.getId(), new ArrayList<>())
                .stream()
                .map(reply -> toResponseTree(reply, commentsByParentId))
                .toList();
        return productCommentMapper.toResponse(comment, replies);
    }

    private ProductComment resolveParent(Long productId, Long parentId) {
        if (parentId == null) {
            return null;
        }
        ProductComment parent = productCommentRepository.findById(parentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND));
        if (!parent.getProduct().getId().equals(productId) || parent.getStatus() != VisibilityStatus.VISIBLE) {
            throw new AppException(ErrorCode.COMMENT_NOT_FOUND);
        }
        return parent;
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
}
