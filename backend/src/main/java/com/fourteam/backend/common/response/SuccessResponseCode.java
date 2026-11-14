package com.fourteam.backend.common.response;

import org.springframework.http.HttpStatus;

public enum SuccessResponseCode implements BaseResponseCode {

	SUCCESS_OK("SUCCESS_200", HttpStatus.OK, "호출에 성공했습니다."),
	SUCCESS_CREATED("SUCCESS_201", HttpStatus.CREATED, "생성에 성공했습니다.");

	private final String code;
	private final HttpStatus httpStatus;
	private final String message;


    SuccessResponseCode(String code, HttpStatus httpStatus, String message) {
        this.code = code;
        this.httpStatus = httpStatus;
        this.message = message;
    }
    public String getCode() { return code; }
    public HttpStatus getHttpStatus() { return httpStatus; }
    public String getMessage() { return message; }
}