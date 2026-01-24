package io.celox.taskflow.task.dto;

import io.celox.taskflow.task.domain.WorkflowStatus;
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
public class WorkflowDto {

    private UUID id;

    private String name;

    private String description;

    private WorkflowStatus status;

    private UserDto owner;

    private String nodesJson;

    private String edgesJson;

    private String triggersJson;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
