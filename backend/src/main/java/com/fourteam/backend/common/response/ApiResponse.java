package com.fourteam.backend.common.response;

import org.springframework.http.ResponseEntity;

public record ApiResponse<T>(boolean isSuccess, String code, String message, T data) {
    public static <T> ResponseEntity<ApiResponse<T>> success(SuccessResponseCode code, T data) {
        return ResponseEntity.status(code.getHttpStatus())
                .body(new ApiResponse<>(true, code.getCode(), code.getMessage(), data));
    }

    public static ResponseEntity<ApiResponse<Void>> success(SuccessResponseCode code) {
        return success(code, null);
    }

    public static <T> ApiResponse<T> failure(BaseResponseCode code, T data) {
        return new ApiResponse<>(false, code.getCode(), code.getMessage(), data);
    }
}
