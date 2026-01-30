package io.celox.taskflow.task.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmailResponse {
    private boolean success;
    private String to;
    private String subject;
    private String error;
    private long executionTimeMs;
}
