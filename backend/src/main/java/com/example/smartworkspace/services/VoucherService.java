package com.example.smartworkspace.services;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.commons.PageResponse;
import com.example.smartworkspace.dtos.voucher.VoucherRequest;
import com.example.smartworkspace.dtos.voucher.VoucherResponse;
import com.example.smartworkspace.entities.Voucher;
import com.example.smartworkspace.enums.CommonStatus;
import com.example.smartworkspace.mappers.VoucherMapper;
import com.example.smartworkspace.repositories.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VoucherService {
    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;

    @Transactional(readOnly = true)
    public PageResponse<VoucherResponse> getVouchers(String search, CommonStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));
        return PageResponse.from(voucherRepository
                .findAdminVouchers(normalize(search), status, pageable)
                .map(voucherMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public VoucherResponse getVoucher(Long id) {
        return voucherMapper.toResponse(getVoucherEntity(id));
    }

    @Transactional
    public VoucherResponse createVoucher(VoucherRequest request) {
        String code = normalizeCode(request.getCode());
        if (voucherRepository.existsByCode(code)) {
            throw new AppException(ErrorCode.VOUCHER_CODE_ALREADY_EXISTS);
        }
        Voucher voucher = new Voucher();
        applyRequest(voucher, request, code);
        return voucherMapper.toResponse(voucherRepository.save(voucher));
    }

    @Transactional
    public VoucherResponse updateVoucher(Long id, VoucherRequest request) {
        Voucher voucher = getVoucherEntity(id);
        String code = normalizeCode(request.getCode());
        if (voucherRepository.existsByCodeAndIdNot(code, id)) {
            throw new AppException(ErrorCode.VOUCHER_CODE_ALREADY_EXISTS);
        }
        applyRequest(voucher, request, code);
        return voucherMapper.toResponse(voucherRepository.save(voucher));
    }

    @Transactional
    public void deleteVoucher(Long id) {
        voucherRepository.delete(getVoucherEntity(id));
    }

    private Voucher getVoucherEntity(Long id) {
        return voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
    }

    private void applyRequest(Voucher voucher, VoucherRequest request, String code) {
        voucher.setCode(code);
        voucher.setName(trim(request.getName()));
        voucher.setDescription(trim(request.getDescription()));
        voucher.setDiscountType(request.getDiscountType());
        voucher.setDiscountValue(request.getDiscountValue());
        voucher.setMinOrderAmount(request.getMinOrderAmount());
        voucher.setUsageLimit(request.getUsageLimit());
        voucher.setStartDate(request.getStartDate());
        voucher.setEndDate(request.getEndDate());
        voucher.setStatus(request.getStatus());
    }

    @Transactional(readOnly = true)
    public com.example.smartworkspace.dtos.voucher.VoucherCheckResponse validateVoucher(String code, java.math.BigDecimal subtotal) {
        String normalizedCode = normalizeCode(code);
        if (normalizedCode == null) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Mã giảm giá không hợp lệ");
        }
        Voucher voucher = voucherRepository.findByCode(normalizedCode)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST, "Mã giảm giá không tồn tại"));

        if (voucher.getStatus() != CommonStatus.ACTIVE) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Mã giảm giá không hoạt động");
        }
        
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Mã giảm giá đã hết hạn hoặc chưa bắt đầu");
        }

        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Mã giảm giá đã hết lượt sử dụng chung");
        }

        if (subtotal != null && subtotal.compareTo(voucher.getMinOrderAmount()) < 0) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã này");
        }

        java.math.BigDecimal discountAmount;
        if (voucher.getDiscountType() == com.example.smartworkspace.enums.DiscountType.PERCENT) {
            discountAmount = subtotal.multiply(voucher.getDiscountValue()).divide(java.math.BigDecimal.valueOf(100), 0, java.math.RoundingMode.DOWN);
        } else {
            discountAmount = voucher.getDiscountValue();
        }

        if (discountAmount.compareTo(subtotal) > 0) {
            discountAmount = subtotal;
        }
        
        java.math.BigDecimal amountAfterDiscount = subtotal.subtract(discountAmount);

        return com.example.smartworkspace.dtos.voucher.VoucherCheckResponse.builder()
                .valid(true)
                .voucherCode(voucher.getCode())
                .discountType(voucher.getDiscountType())
                .discountValue(voucher.getDiscountValue())
                .discountAmount(discountAmount)
                .amountAfterDiscount(amountAfterDiscount)
                .message("Áp dụng mã giảm giá thành công")
                .build();
    }

    private String normalizeCode(String code) {
        return trim(code).toUpperCase();
    }

    private String normalize(String value) {
        String trimmed = trim(value);
        return trimmed == null || trimmed.isEmpty() ? null : trimmed;
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }
}
