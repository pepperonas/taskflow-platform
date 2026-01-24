package io.celox.taskflow.task.workflow.executors;

import io.celox.taskflow.task.workflow.ExecutionContext;
import io.celox.taskflow.task.workflow.NodeExecutor;
import io.celox.taskflow.task.workflow.WorkflowNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DelayExecutor implements NodeExecutor {

    @Override
    public Object execute(WorkflowNode node, ExecutionContext context) {
        Map<String, Object> data = node.getData();

        context.log("Executing Delay node: " + node.getId());

        // Get delay duration in milliseconds
        Integer delayMs = (Integer) data.getOrDefault("delayMs", 1000);

        try {
            context.log("Delaying execution for " + delayMs + "ms");
            Thread.sleep(delayMs);
            context.log("Delay completed");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Delay interrupted", e);
            context.log("Delay interrupted: " + e.getMessage());
        }

        return null;
    }

    @Override
    public String getNodeType() {
        return "delay";
    }
}
