package io.celox.taskflow.task.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.celox.taskflow.task.domain.TaskPriority;
import io.celox.taskflow.task.domain.TaskStatus;
import io.celox.taskflow.task.dto.CreateTaskDto;
import io.celox.taskflow.task.dto.TaskDto;
import io.celox.taskflow.task.dto.UpdateTaskDto;
import io.celox.taskflow.task.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldGetAllTasks() throws Exception {
        // Given
        TaskDto task1 = TaskDto.builder()
                .id(UUID.randomUUID())
                .title("Task 1")
                .status(TaskStatus.OPEN)
                .priority(TaskPriority.HIGH)
                .build();

        TaskDto task2 = TaskDto.builder()
                .id(UUID.randomUUID())
                .title("Task 2")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.MEDIUM)
                .build();

        List<TaskDto> tasks = Arrays.asList(task1, task2);

        when(taskService.getAllTasks()).thenReturn(tasks);

        // When & Then
        mockMvc.perform(get("/api/v1/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Task 1"))
                .andExpect(jsonPath("$[1].title").value("Task 2"));
    }

    @Test
    void shouldGetTaskById() throws Exception {
        // Given
        UUID taskId = UUID.randomUUID();
        TaskDto task = TaskDto.builder()
                .id(taskId)
                .title("Test Task")
                .status(TaskStatus.OPEN)
                .priority(TaskPriority.HIGH)
                .build();

        when(taskService.getTaskById(taskId)).thenReturn(task);

        // When & Then
        mockMvc.perform(get("/api/v1/tasks/{id}", taskId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(taskId.toString()))
                .andExpect(jsonPath("$.title").value("Test Task"));
    }

    @Test
    void shouldCreateTask() throws Exception {
        // Given
        CreateTaskDto createDto = CreateTaskDto.builder()
                .title("New Task")
                .description("Task Description")
                .priority(TaskPriority.HIGH)
                .build();

        UUID taskId = UUID.randomUUID();
        TaskDto createdTask = TaskDto.builder()
                .id(taskId)
                .title("New Task")
                .description("Task Description")
                .status(TaskStatus.OPEN)
                .priority(TaskPriority.HIGH)
                .build();

        when(taskService.createTask(any(CreateTaskDto.class))).thenReturn(createdTask);

        // When & Then
        mockMvc.perform(post("/api/v1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(taskId.toString()))
                .andExpect(jsonPath("$.title").value("New Task"))
                .andExpect(jsonPath("$.status").value("OPEN"));
    }

    @Test
    void shouldUpdateTask() throws Exception {
        // Given
        UUID taskId = UUID.randomUUID();
        UpdateTaskDto updateDto = UpdateTaskDto.builder()
                .title("Updated Task")
                .status(TaskStatus.IN_PROGRESS)
                .build();

        TaskDto updatedTask = TaskDto.builder()
                .id(taskId)
                .title("Updated Task")
                .status(TaskStatus.IN_PROGRESS)
                .build();

        when(taskService.updateTask(eq(taskId), any(UpdateTaskDto.class))).thenReturn(updatedTask);

        // When & Then
        mockMvc.perform(put("/api/v1/tasks/{id}", taskId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Task"))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }

    @Test
    void shouldDeleteTask() throws Exception {
        // Given
        UUID taskId = UUID.randomUUID();
        doNothing().when(taskService).deleteTask(taskId);

        // When & Then
        mockMvc.perform(delete("/api/v1/tasks/{id}", taskId))
                .andExpect(status().isNoContent());

        verify(taskService, times(1)).deleteTask(taskId);
    }

    @Test
    void shouldGetTasksByStatus() throws Exception {
        // Given
        TaskDto task = TaskDto.builder()
                .id(UUID.randomUUID())
                .title("Open Task")
                .status(TaskStatus.OPEN)
                .build();

        List<TaskDto> tasks = Arrays.asList(task);

        when(taskService.getTasksByStatus(TaskStatus.OPEN)).thenReturn(tasks);

        // When & Then
        mockMvc.perform(get("/api/v1/tasks/status/OPEN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].status").value("OPEN"));
    }

    @Test
    void shouldGetTasksByAssignee() throws Exception {
        // Given
        UUID assigneeId = UUID.randomUUID();
        TaskDto task = TaskDto.builder()
                .id(UUID.randomUUID())
                .title("Assigned Task")
                .build();

        List<TaskDto> tasks = Arrays.asList(task);

        when(taskService.getTasksByAssignee(assigneeId)).thenReturn(tasks);

        // When & Then
        mockMvc.perform(get("/api/v1/tasks/assignee/{assigneeId}", assigneeId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }
}
