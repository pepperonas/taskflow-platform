package io.celox.taskflow.task.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Request DTO for sending emails.
 * All fields are validated to prevent abuse.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailRequest {

    @NotBlank(message = "Recipient email (to) is required")
    @Email(message = "Recipient email must be a valid email address")
    @Size(max = 254, message = "Email address must not exceed 254 characters")
    private String to;

    @NotBlank(message = "Subject is required")
    @Size(min = 1, max = 200, message = "Subject must be between 1 and 200 characters")
    private String subject;

    @NotBlank(message = "Email body is required")
    @Size(min = 1, max = 50000, message = "Email body must be between 1 and 50000 characters")
    private String body;

    @Email(message = "Sender email must be a valid email address")
    @Size(max = 254, message = "Sender email address must not exceed 254 characters")
    private String from;

    private Map<String, Object> triggerData;
}
