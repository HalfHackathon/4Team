package com.fourteam.backend.common;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fourteam.backend.common.response.ApiResponse;
import com.fourteam.backend.common.response.SuccessResponseCode;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
public class HealthController {
    @Operation(summary = "애플리케이션 상태 확인")
    @GetMapping({"/api/v1/health", "/api/health"})
    public ResponseEntity<ApiResponse<Map<String, String>>> health() {
        return ApiResponse.success(SuccessResponseCode.SUCCESS_OK, Map.of("status", "UP"));
    }
}
