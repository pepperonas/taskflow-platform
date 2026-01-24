package io.celox.taskflow.task.service;

import io.celox.taskflow.task.domain.Task;
import io.celox.taskflow.task.domain.TaskPriority;
import io.celox.taskflow.task.domain.TaskStatus;
import io.celox.taskflow.task.dto.CreateTaskDto;
import io.celox.taskflow.task.dto.TaskDto;
import io.celox.taskflow.task.kafka.TaskEventProducer;
import io.celox.taskflow.task.mapper.TaskMapper;
import io.celox.taskflow.task.repository.TaskRepository;
import io.celox.taskflow.task.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TaskMapper taskMapper;

    @Mock
    private TaskEventProducer eventProducer;

    @InjectMocks
    private TaskService taskService;

    @Test
    void shouldCreateTaskSuccessfully() {
        // Given
        CreateTaskDto createDto = CreateTaskDto.builder()
                .title("Test Task")
                .description("Test Description")
                .priority(TaskPriority.HIGH)
                .build();

        Task task = Task.builder()
                .id(UUID.randomUUID())
                .title("Test Task")
                .status(TaskStatus.OPEN)
                .priority(TaskPriority.HIGH)
                .build();

        TaskDto taskDto = TaskDto.builder()
                .id(task.getId())
                .title("Test Task")
                .status(TaskStatus.OPEN)
                .priority(TaskPriority.HIGH)
                .build();

        when(taskMapper.toEntity(createDto)).thenReturn(task);
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(taskMapper.toDto(task)).thenReturn(taskDto);

        // When
        TaskDto result = taskService.createTask(createDto);

        // Then
        assertNotNull(result);
        assertEquals("Test Task", result.getTitle());
        assertEquals(TaskStatus.OPEN, result.getStatus());
        verify(taskRepository, times(1)).save(any(Task.class));
        verify(eventProducer, times(1)).sendTaskCreatedEvent(any());
    }
}
