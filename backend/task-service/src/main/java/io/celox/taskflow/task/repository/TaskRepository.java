package io.celox.taskflow.task.repository;

import io.celox.taskflow.task.domain.Task;
import io.celox.taskflow.task.domain.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID>, JpaSpecificationExecutor<Task> {

    List<Task> findByAssigneeId(UUID assigneeId);

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByDueDateBefore(LocalDateTime date);

    List<Task> findByAssigneeIdAndStatus(UUID assigneeId, TaskStatus status);
}
