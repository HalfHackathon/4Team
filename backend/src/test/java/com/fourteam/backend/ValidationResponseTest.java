package com.fourteam.backend;

import com.fourteam.backend.common.response.ApiExceptionHandler;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.containsInAnyOrder;

class ValidationResponseTest {
    record Input(@NotBlank String semester, @NotBlank String departmentId) {}

    @RestController
    static class Endpoint {
        @PostMapping("/validate")
        void validate(@Valid @RequestBody Input input) {}
    }

    @Test
    void returnsAllInvalidFieldsAndDistinguishesMalformedJson() throws Exception {
        var mvc = MockMvcBuilders.standaloneSetup(new Endpoint())
                .setControllerAdvice(new ApiExceptionHandler()).build();
        mvc.perform(post("/validate").contentType("application/json").content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("COMMON_400_2"))
                .andExpect(jsonPath("$.data[*].field").value(containsInAnyOrder("semester", "departmentId")));
        mvc.perform(post("/validate").contentType("application/json").content("{"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("GLOBAL_400_2"));
    }
}