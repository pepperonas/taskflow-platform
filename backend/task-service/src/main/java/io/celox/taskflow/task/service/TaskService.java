package io.celox.taskflow.task.service;

import io.celox.taskflow.shared.events.TaskCompletedEvent;
import io.celox.taskflow.shared.events.TaskCreatedEvent;
import io.celox.taskflow.shared.events.TaskDeletedEvent;
import io.celox.taskflow.shared.events.TaskUpdatedEvent;
import io.celox.taskflow.task.domain.Task;
import io.celox.taskflow.task.domain.TaskStatus;
import io.celox.taskflow.task.domain.User;
import io.celox.taskflow.task.dto.CreateTaskDto;
import io.celox.taskflow.task.dto.TaskDto;
import io.celox.taskflow.task.dto.UpdateTaskDto;
import io.celox.taskflow.task.exception.ResourceNotFoundException;
import io.celox.taskflow.task.kafka.TaskEventProducer;
import io.celox.taskflow.task.mapper.TaskMapper;
import io.celox.taskflow.task.repository.TaskRepository;
import io.celox.taskflow.task.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;
    private final TaskEventProducer eventProducer;

    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasks() {
        log.debug("Fetching all tasks");
        return taskRepository.findAll().stream()
                .map(taskMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDto getTaskById(UUID id) {
        log.debug("Fetching task with id: {}", id);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return taskMapper.toDto(task);
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByAssignee(UUID assigneeId) {
        log.debug("Fetching tasks for assignee: {}", assigneeId);
        return taskRepository.findByAssigneeId(assigneeId).stream()
                .map(taskMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByStatus(TaskStatus status) {
        log.debug("Fetching tasks with status: {}", status);
        return taskRepository.findByStatus(status).stream()
                .map(taskMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDto createTask(CreateTaskDto dto) {
        log.info("Creating new task: {}", dto.getTitle());

        Task task = taskMapper.toEntity(dto);

        // Set assignee if provided
        if (dto.getAssigneeId() != null) {
            User assignee = userRepository.findById(dto.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getAssigneeId()));
            task.setAssignee(assignee);
        }

        Task savedTask = taskRepository.save(task);

        // Publish event to Kafka
        TaskCreatedEvent event = new TaskCreatedEvent(
                savedTask.getId(),
                savedTask.getTitle(),
                savedTask.getDescription(),
                savedTask.getStatus().name(),
                savedTask.getPriority().name(),
                savedTask.getAssignee() != null ? savedTask.getAssignee().getId() : null,
                savedTask.getDueDate()
        );
        eventProducer.sendTaskCreatedEvent(event);

        log.info("Task created successfully with id: {}", savedTask.getId());
        return taskMapper.toDto(savedTask);
    }

    @Transactional
    public TaskDto updateTask(UUID id, UpdateTaskDto dto) {
        log.info("Updating task with id: {}", id);

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        TaskStatus oldStatus = task.getStatus();

        taskMapper.updateEntity(task, dto);

        // Update assignee if provided
        if (dto.getAssigneeId() != null) {
            User assignee = userRepository.findById(dto.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getAssigneeId()));
            task.setAssignee(assignee);
        }

        // Handle completion
        if (dto.getStatus() == TaskStatus.COMPLETED && oldStatus != TaskStatus.COMPLETED) {
            task.setCompletedAt(LocalDateTime.now());
            Task savedTask = taskRepository.save(task);

            // Publish completion event
            TaskCompletedEvent event = new TaskCompletedEvent(
                    savedTask.getId(),
                    savedTask.getTitle(),
                    savedTask.getAssignee() != null ? savedTask.getAssignee().getId() : null
            );
            eventProducer.sendTaskCompletedEvent(event);

            return taskMapper.toDto(savedTask);
        }

        Task savedTask = taskRepository.save(task);

        // Publish update event
        TaskUpdatedEvent event = new TaskUpdatedEvent(
                savedTask.getId(),
                savedTask.getTitle(),
                savedTask.getDescription(),
                savedTask.getStatus().name(),
                savedTask.getPriority().name(),
                savedTask.getAssignee() != null ? savedTask.getAssignee().getId() : null,
                savedTask.getDueDate()
        );
        eventProducer.sendTaskUpdatedEvent(event);

        log.info("Task updated successfully with id: {}", savedTask.getId());
        return taskMapper.toDto(savedTask);
    }

    @Transactional
    public void deleteTask(UUID id) {
        log.info("Deleting task with id: {}", id);

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        // Publish delete event
        TaskDeletedEvent event = new TaskDeletedEvent(
                task.getId(),
                task.getTitle(),
                task.getAssignee() != null ? task.getAssignee().getId() : null
        );
        eventProducer.sendTaskDeletedEvent(event);

        taskRepository.delete(task);
        log.info("Task deleted successfully with id: {}", id);
    }
}
