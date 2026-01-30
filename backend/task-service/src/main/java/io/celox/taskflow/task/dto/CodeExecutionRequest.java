package io.celox.taskflow.task.dto;

import lombok.Data;

import java.util.Map;

@Data
public class CodeExecutionRequest {
    private String code;
    private Map<String, Object> triggerData;
}
