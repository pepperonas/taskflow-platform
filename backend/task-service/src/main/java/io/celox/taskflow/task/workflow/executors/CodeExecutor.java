package io.celox.taskflow.task.workflow.executors;

import io.celox.taskflow.task.workflow.ExecutionContext;
import io.celox.taskflow.task.workflow.NodeExecutor;
import io.celox.taskflow.task.workflow.WorkflowNode;
import lombok.extern.slf4j.Slf4j;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@Component
@Slf4j
public class CodeExecutor implements NodeExecutor {

    private static final int MAX_EXECUTION_TIME_MS = 5000;
    
    // Dangerous JavaScript patterns to block
    private static final List<String> DANGEROUS_PATTERNS = Arrays.asList(
        "eval\\s*\\(",
        "Function\\s*\\(",
        "setTimeout\\s*\\(",
        "setInterval\\s*\\(",
        "require\\s*\\(",
        "import\\s+",
        "process\\.",
        "global\\.",
        "window\\.",
        "document\\.",
        "XMLHttpRequest",
        "fetch\\s*\\(",
        "WebSocket",
        "child_process",
        "fs\\.",
        "os\\.",
        "__dirname",
        "__filename"
    );

    @Override
    public Object execute(WorkflowNode node, ExecutionContext context) {
        Map<String, Object> data = node.getData();
        
        context.log("Executing Code node: " + node.getId());

        // Read code from config (like EmailExecutor does)
        String code = null;
        if (data.containsKey("config")) {
            Object configObj = data.get("config");
            if (configObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> config = (Map<String, Object>) configObj;
                code = (String) config.get("code");
            }
        }
        
        // Fallback to direct code field for backwards compatibility
        if (code == null || code.trim().isEmpty()) {
            code = (String) data.get("code");
        }
        
        if (code == null || code.trim().isEmpty()) {
            context.log("Warning: No code provided");
            throw new RuntimeException("No code provided in Code node");
        }

        // Validate code for dangerous patterns
        String validationError = validateCode(code);
        if (validationError != null) {
            String error = "Code validation failed: " + validationError;
            log.warn("SECURITY ALERT: Dangerous code detected in node {}: {}", node.getId(), code);
            log.warn("SECURITY ALERT: {}", error);
            context.log("ERROR: " + error);
            throw new RuntimeException(error);
        }

        try {
            // Create a sandboxed JavaScript context
            Context jsContext = Context.newBuilder("js")
                    .allowAllAccess(false)  // SECURITY: No file/network access
                    .allowIO(false)          // SECURITY: No I/O operations
                    .allowNativeAccess(false) // SECURITY: No native code access
                    .allowCreateProcess(false) // SECURITY: No process creation
                    .allowCreateThread(false)  // SECURITY: No thread creation
                    .option("js.strict", "true")
                    .option("js.ecmascript-version", "2022")
                    .build();

            try {
                // Inject context variables
                Value bindings = jsContext.getBindings("js");

                // Make trigger data available
                Map<String, Object> triggerData = context.getTriggerData();
                if (triggerData != null) {
                    bindings.putMember("$trigger", jsContext.asValue(triggerData));
                }

                // Make previous node outputs available
                Map<String, Object> variables = context.getVariables();
                if (variables != null) {
                    // Add all variables as $nodeId
                    for (Map.Entry<String, Object> entry : variables.entrySet()) {
                        String key = entry.getKey();
                        if (key.endsWith("_result")) {
                            String nodeId = key.substring(0, key.length() - "_result".length());
                            bindings.putMember("$" + nodeId, jsContext.asValue(entry.getValue()));
                        }
                    }
                    // Also add as $vars for convenience
                    bindings.putMember("$vars", jsContext.asValue(variables));
                }

                // Add workflow context
                bindings.putMember("$context", jsContext.asValue(Map.of(
                    "nodeId", node.getId()
                )));

                context.log("Executing JavaScript code (timeout: " + MAX_EXECUTION_TIME_MS + "ms)");

                // Execute with timeout - make code final for lambda
                final String finalCode = code;
                CompletableFuture<Value> future = CompletableFuture.supplyAsync(() -> {
                    try {
                        return jsContext.eval("js", finalCode);
                    } catch (Exception e) {
                        throw new RuntimeException("JavaScript execution error: " + e.getMessage(), e);
                    }
                });

                Value result = future.get(MAX_EXECUTION_TIME_MS, TimeUnit.MILLISECONDS);
                Object convertedResult = convertValueToJava(result);

                context.log("Code execution successful");
                context.setVariable(node.getId() + "_result", convertedResult);

                return convertedResult;

            } finally {
                jsContext.close();
            }

        } catch (TimeoutException e) {
            String error = "Code execution timeout (" + MAX_EXECUTION_TIME_MS + "ms exceeded)";
            log.error(error, e);
            context.log("ERROR: " + error);
            throw new RuntimeException(error);
        } catch (Exception e) {
            String error = "Code execution failed: " + e.getMessage();
            log.error(error, e);
            context.log("ERROR: " + error);
            throw new RuntimeException(error, e);
        }
    }

    /**
     * Validate code for dangerous patterns
     */
    private String validateCode(String code) {
        String codeLower = code.toLowerCase();
        
        // Use word boundaries to avoid false positives (e.g., "evaluate" shouldn't match "eval")
        for (String pattern : DANGEROUS_PATTERNS) {
            // Escape special regex characters in pattern
            String escapedPattern = pattern.replace("\\", "\\\\");
            // Use word boundary to match whole words only
            if (code.matches("(?s).*\\b" + escapedPattern + "\\b.*")) {
                log.warn("SECURITY ALERT: Dangerous code pattern detected: {}", pattern);
                return "Dangerous pattern detected: " + pattern.replace("\\", "");
            }
        }
        
        // Check for suspicious function calls (with word boundaries)
        if (codeLower.matches("(?s).*\\bsystem\\b.*") && codeLower.matches("(?s).*\\bexit\\b.*")) {
            log.warn("SECURITY ALERT: Suspicious system exit call detected");
            return "Suspicious system exit call detected";
        }
        
        return null;
    }

    @Override
    public String getNodeType() {
        return "code";
    }

    /**
     * Convert GraalVM Value to Java object
     */
    private Object convertValueToJava(Value value) {
        if (value == null || value.isNull()) {
            return null;
        }

        if (value.isString()) {
            return value.asString();
        }

        if (value.isNumber()) {
            if (value.fitsInInt()) {
                return value.asInt();
            } else if (value.fitsInLong()) {
                return value.asLong();
            } else {
                return value.asDouble();
            }
        }

        if (value.isBoolean()) {
            return value.asBoolean();
        }

        if (value.hasArrayElements()) {
            List<Object> list = new ArrayList<>();
            long size = value.getArraySize();
            for (long i = 0; i < size; i++) {
                list.add(convertValueToJava(value.getArrayElement(i)));
            }
            return list;
        }

        if (value.hasMembers()) {
            Map<String, Object> map = new HashMap<>();
            for (String key : value.getMemberKeys()) {
                map.put(key, convertValueToJava(value.getMember(key)));
            }
            return map;
        }

        // Fallback to string representation
        return value.toString();
    }
}
