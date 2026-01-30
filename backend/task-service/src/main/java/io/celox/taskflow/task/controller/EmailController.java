package io.celox.taskflow.task.controller;

import io.celox.taskflow.task.dto.EmailRequest;
import io.celox.taskflow.task.dto.EmailResponse;
import io.celox.taskflow.task.workflow.ExecutionContext;
import io.celox.taskflow.task.workflow.WorkflowNode;
import io.celox.taskflow.task.workflow.executors.EmailExecutor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/email")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Email", description = "Email Sending API")
public class EmailController {

    private final EmailExecutor emailExecutor;

    @PostMapping("/send")
    @Operation(summary = "Send an email")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Email sent successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid email request")
    })
    public ResponseEntity<EmailResponse> sendEmail(@RequestBody EmailRequest request) {
        long startTime = System.currentTimeMillis();
        String userId = getCurrentUserId();

        try {
            // Validate request
            if (request.getTo() == null || request.getTo().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new EmailResponse(false, null, null, "Recipient email address is required", System.currentTimeMillis() - startTime));
            }

            // Create a mock workflow node for execution
            WorkflowNode node = new WorkflowNode();
            node.setId("email-node-" + UUID.randomUUID());
            node.setType("email");
            Map<String, Object> nodeData = new HashMap<>();
            Map<String, Object> config = new HashMap<>();
            config.put("to", request.getTo());
            config.put("subject", request.getSubject() != null ? request.getSubject() : "Notification from TaskFlow");
            config.put("body", request.getBody() != null ? request.getBody() : "");
            config.put("from", request.getFrom() != null ? request.getFrom() : "martin.pfeffer@celox.io");
            nodeData.put("config", config);
            node.setData(nodeData);

            // Create execution context with trigger data
            ExecutionContext context = new ExecutionContext();
            if (request.getTriggerData() != null) {
                context.getTriggerData().putAll(request.getTriggerData());
            }

            // Execute email sending
            @SuppressWarnings("unchecked")
            Map<String, Object> result = (Map<String, Object>) emailExecutor.execute(node, context);
            long executionTime = System.currentTimeMillis() - startTime;

            Boolean sent = (Boolean) result.getOrDefault("sent", false);
            String error = (String) result.get("error");
            
            if (sent) {
                log.info("Email sent successfully by user {} to {}: {}ms", userId, request.getTo(), executionTime);
                return ResponseEntity.ok(new EmailResponse(
                    true,
                    request.getTo(),
                    (String) result.get("subject"),
                    null,
                    executionTime
                ));
            } else {
                log.warn("Email sending failed by user {} to {}: {}", userId, request.getTo(), error);
                return ResponseEntity.badRequest()
                    .body(new EmailResponse(false, request.getTo(), null, error, executionTime));
            }

        } catch (Exception e) {
            log.error("Unexpected error while sending email", e);
            long executionTime = System.currentTimeMillis() - startTime;
            return ResponseEntity.internalServerError()
                .body(new EmailResponse(false, request.getTo(), null, "Internal server error: " + e.getMessage(), executionTime));
        }
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            return auth.getName();
        }
        return "anonymous";
    }
}
