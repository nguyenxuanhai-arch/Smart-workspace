package com.example.smartworkspace.commons;

import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.http.converter.HttpMessageNotReadableException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Void>> handleAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        String message = exception.getMessage() != null ? exception.getMessage() : errorCode.getMessage();
        return ResponseEntity
                .status(errorCode.getStatus())
                .body(ApiResponse.error(message));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception
    ) {
        return validationErrorResponse(getFieldErrors(exception.getBindingResult()));
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleBindException(BindException exception) {
        return validationErrorResponse(getFieldErrors(exception.getBindingResult()));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleConstraintViolation(
            ConstraintViolationException exception
    ) {
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getConstraintViolations().forEach(violation ->
                errors.put(violation.getPropertyPath().toString(), violation.getMessage()));
        return validationErrorResponse(errors);
    }

    @ExceptionHandler({
            MissingServletRequestParameterException.class,
            MethodArgumentTypeMismatchException.class,
            HttpMessageNotReadableException.class,
            IllegalArgumentException.class
    })
    public ResponseEntity<ApiResponse<Void>> handleInvalidRequest(Exception exception) {
        return ResponseEntity
                .status(ErrorCode.INVALID_REQUEST.getStatus())
                .body(ApiResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Void>> handleMaxUploadSizeExceeded() {
        return ResponseEntity
                .status(ErrorCode.INVALID_REQUEST.getStatus())
                .body(ApiResponse.error("File size must be less than or equal to 5MB"));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodNotSupported(
            HttpRequestMethodNotSupportedException exception
    ) {
        return ResponseEntity
                .status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(ApiResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception exception) {
        exception.printStackTrace();
        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus())
                .body(ApiResponse.error(ErrorCode.INTERNAL_SERVER_ERROR.getMessage()));
    }

    private Map<String, String> getFieldErrors(org.springframework.validation.BindingResult bindingResult) {
        Map<String, String> errors = new LinkedHashMap<>();
        bindingResult.getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        return errors;
    }

    private ResponseEntity<ApiResponse<Map<String, String>>> validationErrorResponse(Map<String, String> errors) {
        return ResponseEntity
                .status(ErrorCode.VALIDATION_ERROR.getStatus())
                .body(ApiResponse.error(ErrorCode.VALIDATION_ERROR.getMessage(), errors));
    }
}
