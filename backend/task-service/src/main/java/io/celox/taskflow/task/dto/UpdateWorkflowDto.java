package io.celox.taskflow.task.dto;

import io.celox.taskflow.task.domain.WorkflowStatus;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private String nodesJson;

    private String edgesJson;

    private String triggersJson;
}
