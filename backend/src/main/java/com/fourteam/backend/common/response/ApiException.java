package com.fourteam.backend.common.response;

public class ApiException extends RuntimeException {
    private final BaseResponseCode responseCode;

    public ApiException(BaseResponseCode responseCode) {
        super(responseCode.getMessage());
        this.responseCode = responseCode;
    }

    public BaseResponseCode getResponseCode() {
        return responseCode;
    }
}