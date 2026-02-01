package io.celox.taskflow.task.dto;

import io.celox.taskflow.task.domain.WorkflowStatus;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating workflows.
 * All fields are validated to prevent abuse and ensure data integrity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateWorkflowDto {

    @Size(min = 3, max = 200, message = "Name must be between 3 and 200 characters")
    private String name;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    private WorkflowStatus status;

    @Size(max = 500000, message = "Workflow nodes JSON must not exceed 500KB")
    private String nodesJson;

    @Size(max = 100000, message = "Workflow edges JSON must not exceed 100KB")
    private String edgesJson;

    @Size(max = 50000, message = "Workflow triggers JSON must not exceed 50KB")
    private String triggersJson;
}
