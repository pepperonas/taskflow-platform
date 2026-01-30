package io.celox.taskflow.task.dto;

import lombok.Data;

import java.util.Map;

@Data
public class EmailRequest {
    private String to;
    private String subject;
    private String body;
    private String from;
    private Map<String, Object> triggerData;
}
