package io.celox.taskflow.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Request DTO for creating credentials.
 * All fields are validated for security.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCredentialDto {

    @NotBlank(message = "Credential name is required")
    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    private String name;

    @NotBlank(message = "Credential type is required")
    @Pattern(regexp = "^(api_key|basic_auth|oauth2|bearer_token)$", 
             message = "Type must be one of: api_key, basic_auth, oauth2, bearer_token")
    private String type;

    private Map<String, String> data;
}
