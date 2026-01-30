package io.celox.taskflow.task.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CodeExecutionResponse {
    private Object result;
    private String error;
    private long executionTimeMs;
}
