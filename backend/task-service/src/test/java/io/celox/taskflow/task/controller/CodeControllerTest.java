package io.celox.taskflow.task.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.celox.taskflow.task.dto.CodeExecutionRequest;
import io.celox.taskflow.task.workflow.ExecutionContext;
import io.celox.taskflow.task.workflow.WorkflowNode;
import io.celox.taskflow.task.workflow.executors.CodeExecutor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import org.springframework.test.context.ActiveProfiles;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests for CodeController.
 * Verifies JavaScript code execution, validation, and error handling.
 *
 * @author Martin Pfeffer
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CodeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CodeExecutor codeExecutor;

    @Test
    @WithMockUser(username = "testuser")
    void shouldExecuteValidCode() throws Exception {
        // Given
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .code("return 1 + 1;")
                .build();

        when(codeExecutor.execute(any(WorkflowNode.class), any(ExecutionContext.class)))
                .thenReturn(2);

        // When & Then
        mockMvc.perform(post("/api/v1/code/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(2))
                .andExpect(jsonPath("$.error").isEmpty())
                .andExpect(jsonPath("$.executionTimeMs").exists());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldExecuteCodeWithTriggerData() throws Exception {
        // Given
        Map<String, Object> triggerData = new HashMap<>();
        triggerData.put("taskId", "123");
        triggerData.put("taskTitle", "Test Task");

        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .code("return trigger.taskTitle;")
                .triggerData(triggerData)
                .build();

        when(codeExecutor.execute(any(WorkflowNode.class), any(ExecutionContext.class)))
                .thenReturn("Test Task");

        // When & Then
        mockMvc.perform(post("/api/v1/code/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value("Test Task"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldReturnErrorForInvalidCode() throws Exception {
        // Given
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .code("invalid javascript {{")
                .build();

        when(codeExecutor.execute(any(WorkflowNode.class), any(ExecutionContext.class)))
                .thenThrow(new RuntimeException("SyntaxError: Unexpected token"));

        // When & Then
        mockMvc.perform(post("/api/v1/code/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldRejectEmptyCode() throws Exception {
        // Given
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .code("")
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/code/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldRejectNullCode() throws Exception {
        // Given
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .code(null)
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/code/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldRequireAuthentication() throws Exception {
        // Given
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .code("return 1;")
                .build();

        // When & Then - No authentication
        mockMvc.perform(post("/api/v1/code/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldReturnExecutionTime() throws Exception {
        // Given
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .code("return 42;")
                .build();

        when(codeExecutor.execute(any(WorkflowNode.class), any(ExecutionContext.class)))
                .thenReturn(42);

        // When & Then
        mockMvc.perform(post("/api/v1/code/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.executionTimeMs").isNumber());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldHandleComplexReturnValues() throws Exception {
        // Given
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .code("return { name: 'test', value: 123 };")
                .build();

        Map<String, Object> complexResult = new HashMap<>();
        complexResult.put("name", "test");
        complexResult.put("value", 123);

        when(codeExecutor.execute(any(WorkflowNode.class), any(ExecutionContext.class)))
                .thenReturn(complexResult);

        // When & Then
        mockMvc.perform(post("/api/v1/code/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.name").value("test"))
                .andExpect(jsonPath("$.result.value").value(123));
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldHandleArrayReturnValues() throws Exception {
        // Given
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .code("return [1, 2, 3];")
                .build();

        when(codeExecutor.execute(any(WorkflowNode.class), any(ExecutionContext.class)))
                .thenReturn(java.util.Arrays.asList(1, 2, 3));

        // When & Then
        mockMvc.perform(post("/api/v1/code/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").isArray())
                .andExpect(jsonPath("$.result[0]").value(1))
                .andExpect(jsonPath("$.result[1]").value(2))
                .andExpect(jsonPath("$.result[2]").value(3));
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldHandleTimeoutException() throws Exception {
        // Given
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .code("while(true) {}")
                .build();

        when(codeExecutor.execute(any(WorkflowNode.class), any(ExecutionContext.class)))
                .thenThrow(new RuntimeException("Execution timeout exceeded"));

        // When & Then
        mockMvc.perform(post("/api/v1/code/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Execution timeout exceeded"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldRejectCodeExceedingMaxLength() throws Exception {
        // Given - Code exceeds 50000 characters
        StringBuilder longCode = new StringBuilder();
        for (int i = 0; i < 51000; i++) {
            longCode.append("a");
        }

        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .code(longCode.toString())
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/code/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldExecuteCodeWithStringResult() throws Exception {
        // Given
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .code("return 'Hello, World!';")
                .build();

        when(codeExecutor.execute(any(WorkflowNode.class), any(ExecutionContext.class)))
                .thenReturn("Hello, World!");

        // When & Then
        mockMvc.perform(post("/api/v1/code/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value("Hello, World!"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldExecuteCodeWithBooleanResult() throws Exception {
        // Given
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .code("return true;")
                .build();

        when(codeExecutor.execute(any(WorkflowNode.class), any(ExecutionContext.class)))
                .thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/v1/code/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(true));
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldExecuteCodeWithNullResult() throws Exception {
        // Given
        CodeExecutionRequest request = CodeExecutionRequest.builder()
                .code("return null;")
                .build();

        when(codeExecutor.execute(any(WorkflowNode.class), any(ExecutionContext.class)))
                .thenReturn(null);

        // When & Then
        mockMvc.perform(post("/api/v1/code/execute")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").isEmpty());
    }
}
