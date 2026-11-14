package com.fourteam.backend.common.response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import static com.fourteam.backend.common.response.ErrorResponseCode.*;

@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {
    private static final Logger LOG = LoggerFactory.getLogger(ApiExceptionHandler.class);
    public record Violation(String field, String message) {}

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        ErrorResponseCode code;
        Object details = null;
        if (ex instanceof MethodArgumentNotValidException invalid) {
            code = VALIDATION_FAILED;
            details = invalid.getBindingResult().getAllErrors().stream().map(error ->
                    new Violation(error instanceof FieldError f ? f.getField() : error.getObjectName(),
                            error.getDefaultMessage())).toList();
        } else if (ex instanceof HandlerMethodValidationException invalid && !invalid.isForReturnValue()) {
            code = VALIDATION_FAILED;
            details = invalid.getParameterValidationResults().stream().flatMap(result ->
                    result.getResolvableErrors().stream().map(error -> new Violation(
                            error instanceof FieldError f ? f.getField() : result.getMethodParameter().getParameterName(),
                            error.getDefaultMessage()))).toList();
        } else {
            code = switch (status.value()) {
                case 400 -> ex instanceof org.springframework.http.converter.HttpMessageNotReadableException
                        ? INVALID_HTTP_MESSAGE_BODY : INVALID_HTTP_MESSAGE_PARAMETER;
                case 401 -> UNAUTHORIZED_REQUEST;
                case 403 -> ACCESS_DENIED_REQUEST;
                case 404 -> NOT_FOUND_ENDPOINT;
                case 405 -> UNSUPPORTED_HTTP_METHOD;
                case 415 -> UNSUPPORTED_MEDIA_TYPE;
                case 500 -> SERVER_ERROR;
                default -> null;
            };
        }
        if (code == null) {
            return new ResponseEntity<>(new ApiResponse<>(false, "GLOBAL_" + status.value(),
                    "요청을 처리할 수 없습니다.", null), headers, status);
        }
        return new ResponseEntity<>(ApiResponse.failure(code, details), headers, status);
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> business(ApiException ex) {
        var code = ex.getResponseCode();
        return ResponseEntity.status(code.getHttpStatus()).body(ApiResponse.failure(code, null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> unexpected(Exception ex) {
        LOG.error("Unhandled API exception", ex);
        return ResponseEntity.status(SERVER_ERROR.getHttpStatus()).body(ApiResponse.failure(SERVER_ERROR, null));
    }
}
