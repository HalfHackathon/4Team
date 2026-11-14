package com.fourteam.backend.config;

import java.net.http.HttpClient;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration(proxyBeanMethods = false)
public class LlmClientConfig {
    // 제공사 선정 후 URL과 인증 정보를 설정하면 활성화됩니다.
    @Bean
    @ConditionalOnProperty(name = "app.ai.base-url")
    RestClient llmRestClient(RestClient.Builder builder,
            @Value("${app.ai.base-url}") String baseUrl) {
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(60));
        return builder.clone().baseUrl(baseUrl).requestFactory(requestFactory).build();
    }
}
