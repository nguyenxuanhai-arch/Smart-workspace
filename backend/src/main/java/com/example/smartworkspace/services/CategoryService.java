package com.example.smartworkspace.services;

import java.util.List;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.dtos.category.CategoryRequest;
import com.example.smartworkspace.dtos.category.CategoryResponse;
import com.example.smartworkspace.entities.Category;
import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.mappers.CategoryMapper;
import com.example.smartworkspace.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByStatusOrderByIdAsc(CommonStatus.ACTIVE).stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getActiveCategory(Long id) {
        Category category = categoryRepository.findByIdAndStatus(id, CommonStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toResponse(category);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        String slug = trim(request.getSlug());
        if (categoryRepository.existsBySlug(slug)) {
            throw new AppException(ErrorCode.CATEGORY_SLUG_ALREADY_EXISTS);
        }

        Category category = new Category();
        applyRequest(category, request);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = getCategoryEntity(id);
        String slug = trim(request.getSlug());

        if (categoryRepository.existsBySlugAndIdNot(slug, id)) {
            throw new AppException(ErrorCode.CATEGORY_SLUG_ALREADY_EXISTS);
        }

        applyRequest(category, request);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategoryEntity(id);
        category.setStatus(CommonStatus.INACTIVE);
        categoryRepository.save(category);
    }

    private Category getCategoryEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    private void applyRequest(Category category, CategoryRequest request) {
        category.setParent(resolveParent(request.getParentId(), category.getId()));
        category.setName(trim(request.getName()));
        category.setSlug(trim(request.getSlug()));
        category.setDescription(trim(request.getDescription()));
        category.setStatus(request.getStatus() == null ? CommonStatus.ACTIVE : request.getStatus());
    }

    private Category resolveParent(Long parentId, Long currentCategoryId) {
        if (parentId == null) {
            return null;
        }
        if (currentCategoryId != null && parentId.equals(currentCategoryId)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Category cannot be its own parent");
        }
        return categoryRepository.findById(parentId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }
}
