package io.celox.taskflow.task.controller;

import io.celox.taskflow.task.dto.CreateWorkflowDto;
import io.celox.taskflow.task.dto.UpdateWorkflowDto;
import io.celox.taskflow.task.dto.WorkflowDto;
import io.celox.taskflow.task.dto.WorkflowExecutionDto;
import io.celox.taskflow.task.service.WorkflowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workflows")
@RequiredArgsConstructor
@Tag(name = "Workflows", description = "Workflow Management API")
public class WorkflowController {

    private final WorkflowService workflowService;

    @GetMapping
    @Operation(summary = "Get all workflows")
    @ApiResponse(responseCode = "200", description = "Workflows retrieved successfully")
    public ResponseEntity<List<WorkflowDto>> getAllWorkflows() {
        return ResponseEntity.ok(workflowService.getAllWorkflows());
    }

    @GetMapping("/owner/{ownerId}")
    @Operation(summary = "Get workflows by owner")
    @ApiResponse(responseCode = "200", description = "Workflows retrieved successfully")
    public ResponseEntity<List<WorkflowDto>> getWorkflowsByOwner(@PathVariable UUID ownerId) {
        return ResponseEntity.ok(workflowService.getWorkflowsByOwner(ownerId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get workflow by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Workflow found"),
            @ApiResponse(responseCode = "404", description = "Workflow not found")
    })
    public ResponseEntity<WorkflowDto> getWorkflowById(@PathVariable UUID id) {
        return ResponseEntity.ok(workflowService.getWorkflowById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new workflow")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Workflow created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<WorkflowDto> createWorkflow(
            @RequestParam UUID ownerId,
            @Valid @RequestBody CreateWorkflowDto dto) {
        WorkflowDto createdWorkflow = workflowService.createWorkflow(ownerId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdWorkflow);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a workflow")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Workflow updated successfully"),
            @ApiResponse(responseCode = "404", description = "Workflow not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<WorkflowDto> updateWorkflow(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateWorkflowDto dto) {
        return ResponseEntity.ok(workflowService.updateWorkflow(id, dto));
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a workflow")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Workflow activated successfully"),
            @ApiResponse(responseCode = "404", description = "Workflow not found")
    })
    public ResponseEntity<WorkflowDto> activateWorkflow(@PathVariable UUID id) {
        return ResponseEntity.ok(workflowService.activateWorkflow(id));
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a workflow")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Workflow deactivated successfully"),
            @ApiResponse(responseCode = "404", description = "Workflow not found")
    })
    public ResponseEntity<WorkflowDto> deactivateWorkflow(@PathVariable UUID id) {
        return ResponseEntity.ok(workflowService.deactivateWorkflow(id));
    }

    @PostMapping("/{id}/execute")
    @Operation(summary = "Execute a workflow manually")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Workflow execution started"),
            @ApiResponse(responseCode = "404", description = "Workflow not found")
    })
    public ResponseEntity<WorkflowExecutionDto> executeWorkflow(
            @PathVariable UUID id,
            @RequestBody(required = false) Map<String, Object> triggerData) {
        return ResponseEntity.ok(workflowService.executeWorkflow(id, triggerData));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a workflow")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Workflow deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Workflow not found")
    })
    public ResponseEntity<Void> deleteWorkflow(@PathVariable UUID id) {
        workflowService.deleteWorkflow(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/executions")
    @Operation(summary = "Get workflow executions")
    @ApiResponse(responseCode = "200", description = "Executions retrieved successfully")
    public ResponseEntity<List<WorkflowExecutionDto>> getWorkflowExecutions(@PathVariable UUID id) {
        return ResponseEntity.ok(workflowService.getWorkflowExecutions(id));
    }

    @GetMapping("/executions/{executionId}")
    @Operation(summary = "Get execution details")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Execution found"),
            @ApiResponse(responseCode = "404", description = "Execution not found")
    })
    public ResponseEntity<WorkflowExecutionDto> getExecutionById(@PathVariable UUID executionId) {
        return ResponseEntity.ok(workflowService.getExecutionById(executionId));
    }
}
