package com.example.smartworkspace.services;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.commons.PageResponse;
import com.example.smartworkspace.dtos.banner.BannerRequest;
import com.example.smartworkspace.dtos.banner.BannerResponse;
import com.example.smartworkspace.entities.Banner;
import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.mappers.BannerMapper;
import com.example.smartworkspace.repositories.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BannerService {
    private final BannerRepository bannerRepository;
    private final BannerMapper bannerMapper;

    @Transactional(readOnly = true)
    public PageResponse<BannerResponse> getBanners(
            String search,
            CommonStatus status,
            String position,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));
        return PageResponse.from(bannerRepository
                .findAdminBanners(normalize(search), status, normalize(position), pageable)
                .map(bannerMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public BannerResponse getBanner(Long id) {
        return bannerMapper.toResponse(getBannerEntity(id));
    }

    @Transactional
    public BannerResponse createBanner(BannerRequest request) {
        Banner banner = new Banner();
        applyRequest(banner, request);
        return bannerMapper.toResponse(bannerRepository.save(banner));
    }

    @Transactional
    public BannerResponse updateBanner(Long id, BannerRequest request) {
        Banner banner = getBannerEntity(id);
        applyRequest(banner, request);
        return bannerMapper.toResponse(bannerRepository.save(banner));
    }

    @Transactional
    public void deleteBanner(Long id) {
        bannerRepository.delete(getBannerEntity(id));
    }

    private Banner getBannerEntity(Long id) {
        return bannerRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BANNER_NOT_FOUND));
    }

    private void applyRequest(Banner banner, BannerRequest request) {
        banner.setTitle(trim(request.getTitle()));
        banner.setImageUrl(trim(request.getImageUrl()));
        banner.setLinkUrl(trim(request.getLinkUrl()));
        banner.setPosition(trim(request.getPosition()));
        banner.setSortOrder(request.getSortOrder());
        banner.setStartDate(request.getStartDate());
        banner.setEndDate(request.getEndDate());
        banner.setStatus(request.getStatus());
    }

    private String normalize(String value) {
        String trimmed = trim(value);
        return trimmed == null || trimmed.isEmpty() ? null : trimmed;
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }
}
