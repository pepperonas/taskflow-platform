package io.celox.taskflow.task.workflow;

public interface NodeExecutor {
    /**
     * Execute a workflow node
     * @param node The node to execute
     * @param context The execution context containing variables and trigger data
     * @return Result object (can be task, boolean for conditions, etc.)
     */
    Object execute(WorkflowNode node, ExecutionContext context);

    /**
     * Get the node type this executor handles
     * @return Node type string (e.g., "createTask", "condition", "delay")
     */
    String getNodeType();
}
