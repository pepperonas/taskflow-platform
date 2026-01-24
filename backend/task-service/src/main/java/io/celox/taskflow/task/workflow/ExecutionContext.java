package io.celox.taskflow.task.workflow;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class ExecutionContext {
    private Map<String, Object> variables;
    private Map<String, Object> triggerData;
    private StringBuilder executionLog;

    public ExecutionContext() {
        this.variables = new HashMap<>();
        this.triggerData = new HashMap<>();
        this.executionLog = new StringBuilder();
    }

    public ExecutionContext(Map<String, Object> triggerData) {
        this();
        this.triggerData = triggerData != null ? triggerData : new HashMap<>();
    }

    public void setVariable(String key, Object value) {
        variables.put(key, value);
    }

    public Object getVariable(String key) {
        return variables.get(key);
    }

    public void log(String message) {
        executionLog.append(message).append("\n");
    }

    public String getExecutionLog() {
        return executionLog.toString();
    }
}
