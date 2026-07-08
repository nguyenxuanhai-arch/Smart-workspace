package com.example.smartworkspace.services;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.commons.PageResponse;
import com.example.smartworkspace.dtos.promotion.PromotionRequest;
import com.example.smartworkspace.dtos.promotion.PromotionResponse;
import com.example.smartworkspace.entities.Promotion;
import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.mappers.PromotionMapper;
import com.example.smartworkspace.repositories.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PromotionService {
    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;

    @Transactional(readOnly = true)
    public PageResponse<PromotionResponse> getPromotions(String search, CommonStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));
        return PageResponse.from(promotionRepository
                .findAdminPromotions(normalize(search), status, pageable)
                .map(promotionMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public PromotionResponse getPromotion(Long id) {
        return promotionMapper.toResponse(getPromotionEntity(id));
    }

    @Transactional
    public PromotionResponse createPromotion(PromotionRequest request) {
        Promotion promotion = new Promotion();
        applyRequest(promotion, request);
        return promotionMapper.toResponse(promotionRepository.save(promotion));
    }

    @Transactional
    public PromotionResponse updatePromotion(Long id, PromotionRequest request) {
        Promotion promotion = getPromotionEntity(id);
        applyRequest(promotion, request);
        return promotionMapper.toResponse(promotionRepository.save(promotion));
    }

    @Transactional
    public void deletePromotion(Long id) {
        Promotion promotion = getPromotionEntity(id);
        promotionRepository.delete(promotion);
    }

    private Promotion getPromotionEntity(Long id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_FOUND));
    }

    private void applyRequest(Promotion promotion, PromotionRequest request) {
        promotion.setName(trim(request.getName()));
        promotion.setDescription(trim(request.getDescription()));
        promotion.setDiscountType(request.getDiscountType());
        promotion.setDiscountValue(request.getDiscountValue());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setStatus(request.getStatus());
    }

    private String normalize(String value) {
        String trimmed = trim(value);
        return trimmed == null || trimmed.isEmpty() ? null : trimmed;
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }
}
