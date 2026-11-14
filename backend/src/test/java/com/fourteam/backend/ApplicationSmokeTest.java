package com.fourteam.backend;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApplicationSmokeTest {
    @LocalServerPort
    private int port;

    @Test
    void servesHealthAndApiDocumentation() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        var health = get(client, "/api/v1/health");
        assertThat(health.statusCode()).isEqualTo(200);
        assertThat(health.body()).contains("\"status\":\"UP\"");
        assertThat(health.body()).contains("\"isSuccess\":true", "\"code\":\"SUCCESS_200\"");
        var missing = get(client, "/api/v1/not-an-endpoint");
        assertThat(missing.statusCode()).isEqualTo(404);
        assertThat(missing.body()).contains("\"isSuccess\":false", "\"code\":\"GLOBAL_404\"", "\"data\":null");
        var docs = get(client, "/v3/api-docs");
        assertThat(docs.statusCode()).isEqualTo(200);
        assertThat(docs.body()).contains("/api/v1/health");
        assertThat(get(client, "/swagger-ui/index.html").statusCode()).isEqualTo(200);
    }

    private HttpResponse<String> get(HttpClient client, String path) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + path))
                .GET().build(), HttpResponse.BodyHandlers.ofString());
    }

}
