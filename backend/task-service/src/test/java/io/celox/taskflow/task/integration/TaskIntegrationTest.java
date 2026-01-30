package io.celox.taskflow.task.integration;

import io.celox.taskflow.task.domain.TaskPriority;
import io.celox.taskflow.task.domain.TaskStatus;
import io.celox.taskflow.task.dto.CreateTaskDto;
import io.celox.taskflow.task.dto.TaskDto;
import io.celox.taskflow.task.dto.UpdateTaskDto;
import io.celox.taskflow.task.repository.TaskRepository;
import io.celox.taskflow.task.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
@Transactional
class TaskIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
    }

    @Test
    void shouldCreateAndRetrieveTask() {
        // Given
        CreateTaskDto createDto = CreateTaskDto.builder()
                .title("Integration Test Task")
                .description("Test Description")
                .priority(TaskPriority.HIGH)
                .build();

        // When
        TaskDto createdTask = taskService.createTask(createDto);

        // Then
        assertNotNull(createdTask.getId());
        assertEquals("Integration Test Task", createdTask.getTitle());
        assertEquals(TaskPriority.HIGH, createdTask.getPriority());
        assertEquals(TaskStatus.OPEN, createdTask.getStatus());

        // Verify it can be retrieved
        TaskDto retrievedTask = taskService.getTaskById(createdTask.getId());
        assertNotNull(retrievedTask);
        assertEquals(createdTask.getId(), retrievedTask.getId());
        assertEquals("Integration Test Task", retrievedTask.getTitle());
    }

    @Test
    void shouldUpdateTask() {
        // Given
        CreateTaskDto createDto = CreateTaskDto.builder()
                .title("Original Task")
                .priority(TaskPriority.LOW)
                .build();

        TaskDto createdTask = taskService.createTask(createDto);

        // When
        UpdateTaskDto updateDto = UpdateTaskDto.builder()
                .title("Updated Task")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.HIGH)
                .build();

        TaskDto updatedTask = taskService.updateTask(createdTask.getId(), updateDto);

        // Then
        assertEquals("Updated Task", updatedTask.getTitle());
        assertEquals(TaskStatus.IN_PROGRESS, updatedTask.getStatus());
        assertEquals(TaskPriority.HIGH, updatedTask.getPriority());
    }

    @Test
    void shouldDeleteTask() {
        // Given
        CreateTaskDto createDto = CreateTaskDto.builder()
                .title("Task to Delete")
                .build();

        TaskDto createdTask = taskService.createTask(createDto);
        UUID taskId = createdTask.getId();

        // When
        taskService.deleteTask(taskId);

        // Then
        assertThrows(Exception.class, () -> taskService.getTaskById(taskId));
    }

    @Test
    void shouldGetAllTasks() {
        // Given
        CreateTaskDto task1 = CreateTaskDto.builder()
                .title("Task 1")
                .priority(TaskPriority.HIGH)
                .build();

        CreateTaskDto task2 = CreateTaskDto.builder()
                .title("Task 2")
                .priority(TaskPriority.MEDIUM)
                .build();

        taskService.createTask(task1);
        taskService.createTask(task2);

        // When
        List<TaskDto> allTasks = taskService.getAllTasks();

        // Then
        assertEquals(2, allTasks.size());
    }

    @Test
    void shouldGetTasksByStatus() {
        // Given
        CreateTaskDto task1 = CreateTaskDto.builder()
                .title("Open Task")
                .build();

        CreateTaskDto task2 = CreateTaskDto.builder()
                .title("Another Open Task")
                .build();

        TaskDto created1 = taskService.createTask(task1);
        TaskDto created2 = taskService.createTask(task2);

        // Update one to IN_PROGRESS
        UpdateTaskDto updateDto = UpdateTaskDto.builder()
                .status(TaskStatus.IN_PROGRESS)
                .build();
        taskService.updateTask(created2.getId(), updateDto);

        // When
        List<TaskDto> openTasks = taskService.getTasksByStatus(TaskStatus.OPEN);
        List<TaskDto> inProgressTasks = taskService.getTasksByStatus(TaskStatus.IN_PROGRESS);

        // Then
        assertEquals(1, openTasks.size());
        assertEquals(1, inProgressTasks.size());
        assertEquals("Open Task", openTasks.get(0).getTitle());
        assertEquals("Another Open Task", inProgressTasks.get(0).getTitle());
    }
}
