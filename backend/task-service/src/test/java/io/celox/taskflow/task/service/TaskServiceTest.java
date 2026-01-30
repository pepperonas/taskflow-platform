package io.celox.taskflow.task.service;

import io.celox.taskflow.task.domain.Task;
import io.celox.taskflow.task.domain.TaskPriority;
import io.celox.taskflow.task.domain.TaskStatus;
import io.celox.taskflow.task.dto.CreateTaskDto;
import io.celox.taskflow.task.dto.TaskDto;
import io.celox.taskflow.task.dto.UpdateTaskDto;
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

    @Test
    void shouldUpdateTaskSuccessfully() {
        // Given
        UUID taskId = UUID.randomUUID();
        UpdateTaskDto updateDto = UpdateTaskDto.builder()
                .title("Updated Task")
                .status(TaskStatus.IN_PROGRESS)
                .build();

        Task existingTask = Task.builder()
                .id(taskId)
                .title("Original Task")
                .status(TaskStatus.OPEN)
                .build();

        Task updatedTask = Task.builder()
                .id(taskId)
                .title("Updated Task")
                .status(TaskStatus.IN_PROGRESS)
                .build();

        TaskDto taskDto = TaskDto.builder()
                .id(taskId)
                .title("Updated Task")
                .status(TaskStatus.IN_PROGRESS)
                .build();

        when(taskRepository.findById(taskId)).thenReturn(java.util.Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenReturn(updatedTask);
        when(taskMapper.toDto(updatedTask)).thenReturn(taskDto);

        // When
        TaskDto result = taskService.updateTask(taskId, updateDto);

        // Then
        assertNotNull(result);
        assertEquals("Updated Task", result.getTitle());
        assertEquals(TaskStatus.IN_PROGRESS, result.getStatus());
        verify(taskRepository, times(1)).findById(taskId);
        verify(taskRepository, times(1)).save(any(Task.class));
        verify(eventProducer, times(1)).sendTaskUpdatedEvent(any());
    }

    @Test
    void shouldDeleteTaskSuccessfully() {
        // Given
        UUID taskId = UUID.randomUUID();
        Task task = Task.builder()
                .id(taskId)
                .title("Task to Delete")
                .build();

        when(taskRepository.findById(taskId)).thenReturn(java.util.Optional.of(task));
        doNothing().when(taskRepository).delete(task);

        // When
        taskService.deleteTask(taskId);

        // Then
        verify(taskRepository, times(1)).findById(taskId);
        verify(taskRepository, times(1)).delete(task);
        verify(eventProducer, times(1)).sendTaskDeletedEvent(any());
    }

    @Test
    void shouldGetAllTasks() {
        // Given
        Task task1 = Task.builder()
                .id(UUID.randomUUID())
                .title("Task 1")
                .build();

        Task task2 = Task.builder()
                .id(UUID.randomUUID())
                .title("Task 2")
                .build();

        TaskDto taskDto1 = TaskDto.builder()
                .id(task1.getId())
                .title("Task 1")
                .build();

        TaskDto taskDto2 = TaskDto.builder()
                .id(task2.getId())
                .title("Task 2")
                .build();

        when(taskRepository.findAll()).thenReturn(java.util.Arrays.asList(task1, task2));
        when(taskMapper.toDto(task1)).thenReturn(taskDto1);
        when(taskMapper.toDto(task2)).thenReturn(taskDto2);

        // When
        java.util.List<TaskDto> result = taskService.getAllTasks();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(taskRepository, times(1)).findAll();
    }
}
