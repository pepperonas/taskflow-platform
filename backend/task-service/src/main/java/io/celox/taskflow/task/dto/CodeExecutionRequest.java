package io.celox.taskflow.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Request DTO for code execution.
 * Code length is limited to prevent resource abuse.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeExecutionRequest {

    @NotBlank(message = "Code is required")
    @Size(min = 1, max = 50000, message = "Code must be between 1 and 50000 characters")
    private String code;

    private Map<String, Object> triggerData;
}
