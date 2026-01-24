package io.celox.taskflow.shared.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TaskCompletedEvent extends TaskEvent {
    private UUID taskId;
    private String title;
    private UUID completedBy;

    public TaskCompletedEvent(UUID taskId, String title, UUID completedBy) {
        super("TASK_COMPLETED");
        this.taskId = taskId;
        this.title = title;
        this.completedBy = completedBy;
    }
}
