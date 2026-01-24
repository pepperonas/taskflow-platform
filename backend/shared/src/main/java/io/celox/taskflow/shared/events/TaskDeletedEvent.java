package io.celox.taskflow.shared.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TaskDeletedEvent extends TaskEvent {
    private UUID taskId;
    private String title;
    private UUID deletedBy;

    public TaskDeletedEvent(UUID taskId, String title, UUID deletedBy) {
        super("TASK_DELETED");
        this.taskId = taskId;
        this.title = title;
        this.deletedBy = deletedBy;
    }
}
