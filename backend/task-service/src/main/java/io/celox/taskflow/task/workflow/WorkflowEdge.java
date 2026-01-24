package io.celox.taskflow.task.workflow;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowEdge {
    private String id;
    private String source;
    private String target;
    private String label;
}
