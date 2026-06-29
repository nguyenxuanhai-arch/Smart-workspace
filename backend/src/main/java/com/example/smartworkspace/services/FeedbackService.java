package com.example.smartworkspace.services;

import com.example.smartworkspace.commons.AppException;
import com.example.smartworkspace.commons.ErrorCode;
import com.example.smartworkspace.commons.PageResponse;
import com.example.smartworkspace.dtos.feedback.FeedbackRequest;
import com.example.smartworkspace.dtos.feedback.FeedbackResponse;
import com.example.smartworkspace.dtos.feedback.FeedbackStatusUpdateRequest;
import com.example.smartworkspace.entities.Feedback;
import com.example.smartworkspace.enums.FeedbackStatus;
import com.example.smartworkspace.mappers.FeedbackMapper;
import com.example.smartworkspace.repositories.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private static final int MAX_PAGE_SIZE = 100;

    private final FeedbackRepository feedbackRepository;
    private final FeedbackMapper feedbackMapper;

    @Transactional
    public FeedbackResponse createFeedback(FeedbackRequest request) {
        Feedback feedback = new Feedback();
        feedback.setFullName(trim(request.getFullName()));
        feedback.setEmail(trimToNull(request.getEmail()));
        feedback.setPhone(trimToNull(request.getPhone()));
        feedback.setSubject(trim(request.getSubject()));
        feedback.setMessage(trim(request.getMessage()));
        feedback.setStatus(FeedbackStatus.NEW);
        return feedbackMapper.toResponse(feedbackRepository.save(feedback));
    }

    @Transactional(readOnly = true)
    public PageResponse<FeedbackResponse> getAdminFeedbacks(int page, int size) {
        Pageable pageable = PageRequest.of(
                safePage(page),
                safeSize(size),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        Page<FeedbackResponse> feedbackPage = feedbackRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(feedbackMapper::toResponse);
        return PageResponse.from(feedbackPage);
    }

    @Transactional
    public FeedbackResponse updateFeedbackStatus(Long id, FeedbackStatusUpdateRequest request) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_FOUND));
        feedback.setStatus(request.getStatus());
        return feedbackMapper.toResponse(feedbackRepository.save(feedback));
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

    private String trimToNull(String value) {
        String trimmed = trim(value);
        return StringUtils.hasText(trimmed) ? trimmed : null;
    }
}
