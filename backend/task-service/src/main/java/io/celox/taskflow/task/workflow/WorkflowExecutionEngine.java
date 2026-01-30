package io.celox.taskflow.task.workflow;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.celox.taskflow.task.domain.ExecutionStatus;
import io.celox.taskflow.task.domain.Workflow;
import io.celox.taskflow.task.domain.WorkflowExecution;
import io.celox.taskflow.task.repository.WorkflowExecutionRepository;
import io.celox.taskflow.task.repository.WorkflowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkflowExecutionEngine {

    private final WorkflowRepository workflowRepository;
    private final WorkflowExecutionRepository executionRepository;
    private final List<NodeExecutor> nodeExecutors;
    private final ObjectMapper objectMapper;

    @Transactional
    public WorkflowExecution executeWorkflow(UUID workflowId, Map<String, Object> triggerData) {
        log.info("Starting workflow execution for workflow: {}", workflowId);

        Workflow workflow = workflowRepository.findById(workflowId)
                .orElseThrow(() -> new IllegalArgumentException("Workflow not found: " + workflowId));

        // Create execution record
        WorkflowExecution execution = WorkflowExecution.builder()
                .workflow(workflow)
                .status(ExecutionStatus.RUNNING)
                .executedAt(LocalDateTime.now())
                .build();
        execution = executionRepository.save(execution);

        ExecutionContext context = new ExecutionContext(triggerData);
        context.log("=== Workflow Execution Started ===");
        context.log("Workflow: " + workflow.getName());
        context.log("Execution ID: " + execution.getId());

        try {
            // Parse nodes and edges
            List<WorkflowNode> nodes = parseNodes(workflow.getNodesJson());
            List<WorkflowEdge> edges = parseEdges(workflow.getEdgesJson());

            if (nodes.isEmpty()) {
                throw new IllegalStateException("Workflow has no nodes");
            }

            // Find start node (trigger node)
            WorkflowNode startNode = nodes.stream()
                    .filter(n -> "trigger".equals(n.getType()))
                    .findFirst()
                    .orElse(nodes.get(0)); // Fallback to first node

            context.log("Starting from node: " + startNode.getId() + " (type: " + startNode.getType() + ")");

            // Execute workflow graph
            executeNodeRecursive(startNode, nodes, edges, context, new HashSet<>());

            // Mark as completed
            execution.setStatus(ExecutionStatus.COMPLETED);
            execution.setCompletedAt(LocalDateTime.now());
            context.log("=== Workflow Execution Completed Successfully ===");

        } catch (Exception e) {
            log.error("Workflow execution failed", e);
            execution.setStatus(ExecutionStatus.FAILED);
            execution.setErrorDetails(e.getMessage());
            execution.setCompletedAt(LocalDateTime.now());
            context.log("=== Workflow Execution Failed ===");
            context.log("Error: " + e.getMessage());
        }

        // Save execution log
        execution.setExecutionLog(context.getExecutionLog());
        execution = executionRepository.save(execution);

        log.info("Workflow execution completed with status: {}", execution.getStatus());
        return execution;
    }

    private void executeNodeRecursive(
            WorkflowNode node,
            List<WorkflowNode> allNodes,
            List<WorkflowEdge> edges,
            ExecutionContext context,
            Set<String> visitedNodes
    ) {
        // Prevent infinite loops
        if (visitedNodes.contains(node.getId())) {
            context.log("Node already visited, skipping: " + node.getId());
            return;
        }
        visitedNodes.add(node.getId());

        // Skip trigger nodes (they don't execute anything)
        if ("trigger".equals(node.getType())) {
            context.log("Skipping trigger node: " + node.getId());
        } else {
            // Execute current node
            Object result = executeNode(node, context);
            context.setVariable(node.getId() + "_result", result);
        }

        // Find outgoing edges
        List<WorkflowEdge> outgoingEdges = edges.stream()
                .filter(e -> e.getSource().equals(node.getId()))
                .collect(Collectors.toList());

        if (outgoingEdges.isEmpty()) {
            context.log("No outgoing edges from node: " + node.getId() + " (end node)");
            return;
        }

        // Execute next nodes
        for (WorkflowEdge edge : outgoingEdges) {
            WorkflowNode nextNode = findNode(allNodes, edge.getTarget());

            if (nextNode == null) {
                context.log("Warning: Next node not found for edge target: " + edge.getTarget());
                continue;
            }

            // Handle conditional edges
            if ("condition".equals(node.getType())) {
                Object conditionResult = context.getVariable(node.getId() + "_result");
                Boolean conditionValue = (Boolean) conditionResult;

                if ("true".equals(edge.getLabel()) && Boolean.TRUE.equals(conditionValue)) {
                    context.log("Following TRUE branch to node: " + nextNode.getId());
                    executeNodeRecursive(nextNode, allNodes, edges, context, visitedNodes);
                } else if ("false".equals(edge.getLabel()) && Boolean.FALSE.equals(conditionValue)) {
                    context.log("Following FALSE branch to node: " + nextNode.getId());
                    executeNodeRecursive(nextNode, allNodes, edges, context, visitedNodes);
                }
            } else {
                // Regular edge, follow it
                context.log("Following edge to node: " + nextNode.getId());
                executeNodeRecursive(nextNode, allNodes, edges, context, visitedNodes);
            }
        }
    }

    private Object executeNode(WorkflowNode node, ExecutionContext context) {
        log.info("=== EXECUTING NODE: {} (type: {}) ===", node.getId(), node.getType());
        log.info("Node data: {}", node.getData());

        // Find appropriate executor
        NodeExecutor executor = nodeExecutors.stream()
                .filter(e -> e.getNodeType().equals(node.getType()))
                .findFirst()
                .orElse(null);

        if (executor == null) {
            context.log("Warning: No executor found for node type: " + node.getType());
            return null;
        }

        try {
            return executor.execute(node, context);
        } catch (Exception e) {
            log.error("Error executing node: " + node.getId(), e);
            context.log("Error executing node " + node.getId() + ": " + e.getMessage());
            throw new RuntimeException("Node execution failed: " + node.getId(), e);
        }
    }

    private WorkflowNode findNode(List<WorkflowNode> nodes, String nodeId) {
        return nodes.stream()
                .filter(n -> n.getId().equals(nodeId))
                .findFirst()
                .orElse(null);
    }

    private List<WorkflowNode> parseNodes(String nodesJson) {
        if (nodesJson == null || nodesJson.isBlank()) {
            return new ArrayList<>();
        }

        try {
            return objectMapper.readValue(nodesJson, new TypeReference<List<WorkflowNode>>() {});
        } catch (Exception e) {
            log.error("Failed to parse workflow nodes", e);
            return new ArrayList<>();
        }
    }

    private List<WorkflowEdge> parseEdges(String edgesJson) {
        if (edgesJson == null || edgesJson.isBlank()) {
            return new ArrayList<>();
        }

        try {
            return objectMapper.readValue(edgesJson, new TypeReference<List<WorkflowEdge>>() {});
        } catch (Exception e) {
            log.error("Failed to parse workflow edges", e);
            return new ArrayList<>();
        }
    }
}
