package io.celox.taskflow.task.dto;

import io.celox.taskflow.task.domain.ExecutionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowExecutionDto {

    private UUID id;

    private UUID workflowId;

    private String workflowName;

    private ExecutionStatus status;

    private String executionLog;

    private String errorDetails;

    private LocalDateTime executedAt;

    private LocalDateTime completedAt;
}
