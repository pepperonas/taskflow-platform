package io.celox.taskflow.task.dto;

import io.celox.taskflow.task.domain.TaskCategory;
import io.celox.taskflow.task.domain.TaskPriority;
import io.celox.taskflow.task.domain.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDto {
    private UUID id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private TaskCategory category;
    private UUID assigneeId;
    private String assigneeName;
    private LocalDateTime dueDate;
    private Set<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
}
