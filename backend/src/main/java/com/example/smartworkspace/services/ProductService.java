package com.example.smartworkspace.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.commons.PageResponse;
import com.example.smartworkspace.dtos.product.ProductRequest;
import com.example.smartworkspace.dtos.product.ProductResponse;
import com.example.smartworkspace.entities.Category;
import com.example.smartworkspace.entities.Product;
import com.example.smartworkspace.entities.ProductImage;
import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.enums.ProductStatus;
import com.example.smartworkspace.mappers.ProductMapper;
import com.example.smartworkspace.repositories.CategoryRepository;
import com.example.smartworkspace.repositories.ProductImageRepository;
import com.example.smartworkspace.repositories.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ProductService {
    private static final int MAX_PAGE_SIZE = 100;

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getActiveProducts(
            String search,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sort,
            int page,
            int size
    ) {
        validatePriceRange(minPrice, maxPrice);
        Pageable pageable = PageRequest.of(safePage(page), safeSize(size), resolveSort(sort));
        Page<ProductResponse> productPage = productRepository
                .findAll(activeProductSpec(search, categoryId, minPrice, maxPrice), pageable)
                .map(this::toResponse);
        return PageResponse.from(productPage);
    }

    @Transactional(readOnly = true)
    public ProductResponse getActiveProductById(Long id) {
        Product product = productRepository.findById(id)
                .filter(this::isPublicProduct)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return toResponse(product);
    }

    @Transactional(readOnly = true)
    public ProductResponse getActiveProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .filter(this::isPublicProduct)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return toResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        String slug = trim(request.getSlug());
        String sku = trim(request.getSku());

        if (productRepository.existsBySlug(slug)) {
            throw new AppException(ErrorCode.PRODUCT_SLUG_ALREADY_EXISTS);
        }
        if (productRepository.existsBySku(sku)) {
            throw new AppException(ErrorCode.PRODUCT_SKU_ALREADY_EXISTS);
        }

        Product product = new Product();
        applyRequest(product, request);
        Product savedProduct = productRepository.save(product);
        replaceImages(savedProduct, request.getImageUrls());
        return toResponse(savedProduct);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        String slug = trim(request.getSlug());
        String sku = trim(request.getSku());

        if (productRepository.existsBySlugAndIdNot(slug, id)) {
            throw new AppException(ErrorCode.PRODUCT_SLUG_ALREADY_EXISTS);
        }
        if (productRepository.existsBySkuAndIdNot(sku, id)) {
            throw new AppException(ErrorCode.PRODUCT_SKU_ALREADY_EXISTS);
        }

        applyRequest(product, request);
        Product savedProduct = productRepository.save(product);
        if (request.getImageUrls() != null) {
            replaceImages(savedProduct, request.getImageUrls());
        }
        return toResponse(savedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setStatus(ProductStatus.INACTIVE);
        productRepository.save(product);
    }

    private ProductResponse toResponse(Product product) {
        List<ProductImage> images = productImageRepository.findByProductIdOrderBySortOrderAsc(product.getId());
        return productMapper.toResponse(product, images);
    }

    private void applyRequest(Product product, ProductRequest request) {
        product.setCategory(getActiveCategory(request.getCategoryId()));
        product.setName(trim(request.getName()));
        product.setSlug(trim(request.getSlug()));
        product.setShortDescription(trim(request.getShortDescription()));
        product.setDescription(trim(request.getDescription()));
        product.setPrice(request.getPrice());
        product.setOldPrice(request.getOldPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setSku(trim(request.getSku()));
        product.setStatus(request.getStatus() == null ? ProductStatus.ACTIVE : request.getStatus());
    }

    private Category getActiveCategory(Long categoryId) {
        return categoryRepository.findByIdAndStatus(categoryId, CommonStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    private void replaceImages(Product product, List<String> imageUrls) {
        productImageRepository.deleteByProductId(product.getId());
        if (imageUrls == null || imageUrls.isEmpty()) {
            return;
        }

        List<ProductImage> images = new ArrayList<>();
        for (int index = 0; index < imageUrls.size(); index++) {
            String imageUrl = trim(imageUrls.get(index));
            if (!StringUtils.hasText(imageUrl)) {
                continue;
            }

            ProductImage image = new ProductImage();
            image.setProduct(product);
            image.setImageUrl(imageUrl);
            image.setAltText(product.getName());
            image.setIsPrimary(index == 0);
            image.setSortOrder(index + 1);
            images.add(image);
        }
        productImageRepository.saveAll(images);
    }

    private Specification<Product> activeProductSpec(
            String search,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("status"), ProductStatus.ACTIVE));
            predicates.add(criteriaBuilder.equal(root.get("category").get("status"), CommonStatus.ACTIVE));

            if (StringUtils.hasText(search)) {
                String keyword = "%" + search.trim().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("shortDescription")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), keyword)
                ));
            }
            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), categoryId));
            }
            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private boolean isPublicProduct(Product product) {
        return product.getStatus() == ProductStatus.ACTIVE
                && product.getCategory().getStatus() == CommonStatus.ACTIVE;
    }

    private Sort resolveSort(String sort) {
        if (!StringUtils.hasText(sort) || "newest".equals(sort)) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }
        return switch (sort) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            default -> throw new AppException(ErrorCode.INVALID_REQUEST, "Invalid product sort");
        };
    }

    private void validatePriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        if (minPrice != null && minPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Min price must be greater than or equal to 0");
        }
        if (maxPrice != null && maxPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Max price must be greater than or equal to 0");
        }
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Min price must be less than or equal to max price");
        }
    }

    private int safePage(int page) {
        return Math.max(page, 0);
    }

    private int safeSize(int size) {
        if (size <= 0) {
            return 10;
        }
        return Math.min(size, MAX_PAGE_SIZE);
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }
}
