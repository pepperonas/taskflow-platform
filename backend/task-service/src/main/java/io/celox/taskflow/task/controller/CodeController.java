package io.celox.taskflow.task.controller;

import io.celox.taskflow.task.dto.CodeExecutionRequest;
import io.celox.taskflow.task.dto.CodeExecutionResponse;
import io.celox.taskflow.task.workflow.ExecutionContext;
import io.celox.taskflow.task.workflow.WorkflowNode;
import io.celox.taskflow.task.workflow.executors.CodeExecutor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/code")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Code Execution", description = "JavaScript Code Execution API")
public class CodeController {

    private final CodeExecutor codeExecutor;

    @PostMapping("/execute")
    @Operation(summary = "Execute JavaScript code")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Code executed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid code or security violation")
    })
    public ResponseEntity<CodeExecutionResponse> executeCode(@Valid @RequestBody CodeExecutionRequest request) {
        long startTime = System.currentTimeMillis();
        String userId = getCurrentUserId();

        try {
            String code = request.getCode();
            if (code == null || code.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new CodeExecutionResponse(null, "No code provided", System.currentTimeMillis() - startTime));
            }

            // Create a mock workflow node for execution
            WorkflowNode node = new WorkflowNode();
            node.setId("test-node-" + UUID.randomUUID());
            node.setType("code");
            Map<String, Object> nodeData = new HashMap<>();
            Map<String, Object> config = new HashMap<>();
            config.put("code", code);
            nodeData.put("config", config);
            node.setData(nodeData);

            // Create execution context with trigger data
            ExecutionContext context = new ExecutionContext();
            if (request.getTriggerData() != null) {
                context.getTriggerData().putAll(request.getTriggerData());
            }

            // Execute code
            Object result = codeExecutor.execute(node, context);
            long executionTime = System.currentTimeMillis() - startTime;

            log.info("Code executed successfully by user {}: {}ms", userId, executionTime);
            return ResponseEntity.ok(new CodeExecutionResponse(result, null, executionTime));

        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            String errorMessage = extractErrorMessage(e);
            
            log.error("Code execution failed for user {}: {}", userId, errorMessage, e);
            return ResponseEntity.badRequest()
                .body(new CodeExecutionResponse(null, errorMessage, executionTime));
        }
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            return auth.getName();
        }
        return "anonymous";
    }

    private String extractErrorMessage(Exception e) {
        String message = e.getMessage();
        if (message == null) {
            return "Code execution failed: " + e.getClass().getSimpleName();
        }
        
        // Extract root cause message
        Throwable cause = e.getCause();
        while (cause != null && cause.getMessage() != null) {
            message = cause.getMessage();
            cause = cause.getCause();
        }
        
        return message;
    }
}
