package io.celox.taskflow.shared.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TaskUpdatedEvent extends TaskEvent {
    private UUID taskId;
    private String title;
    private String description;
    private String status;
    private String priority;
    private UUID assigneeId;
    private LocalDateTime dueDate;

    public TaskUpdatedEvent(UUID taskId, String title, String description,
                           String status, String priority, UUID assigneeId, LocalDateTime dueDate) {
        super("TASK_UPDATED");
        this.taskId = taskId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.assigneeId = assigneeId;
        this.dueDate = dueDate;
    }
}
