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

    @Override
    public Object execute(WorkflowNode node, ExecutionContext context) {
        Map<String, Object> data = node.getData();

        context.log("Executing Code node: " + node.getId());

        String code = (String) data.get("code");
        if (code == null || code.trim().isEmpty()) {
            context.log("Warning: No code provided");
            return null;
        }

        try {
            // Create a sandboxed JavaScript context
            Context jsContext = Context.newBuilder("js")
                    .allowAllAccess(false)  // SECURITY: No file/network access
                    .option("js.strict", "true")
                    .option("js.ecmascript-version", "2022")
                    .build();

            try {
                // Inject context variables
                Value bindings = jsContext.getBindings("js");

                // Make trigger data available
                Map<String, Object> triggerData = context.getTriggerData();
                bindings.putMember("$trigger", jsContext.asValue(triggerData));

                // Make variables available
                Map<String, Object> variables = context.getVariables();
                bindings.putMember("$vars", jsContext.asValue(variables));

                context.log("Executing JavaScript code (timeout: " + MAX_EXECUTION_TIME_MS + "ms)");

                // Execute with timeout
                CompletableFuture<Value> future = CompletableFuture.supplyAsync(() -> {
                    return jsContext.eval("js", code);
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
