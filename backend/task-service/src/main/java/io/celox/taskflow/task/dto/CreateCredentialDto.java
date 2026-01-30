package io.celox.taskflow.task.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCredentialDto {
    private String name;
    private String type; // "api_key", "basic_auth", "oauth2"
    private Map<String, String> data;
}
