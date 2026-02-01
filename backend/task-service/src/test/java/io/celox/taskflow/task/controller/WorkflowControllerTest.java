package io.celox.taskflow.task.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.celox.taskflow.task.config.JwtTokenProvider;
import io.celox.taskflow.task.domain.WorkflowStatus;
import io.celox.taskflow.task.domain.ExecutionStatus;
import io.celox.taskflow.task.dto.CreateWorkflowDto;
import io.celox.taskflow.task.dto.UpdateWorkflowDto;
import io.celox.taskflow.task.dto.WorkflowDto;
import io.celox.taskflow.task.dto.WorkflowExecutionDto;
import io.celox.taskflow.task.service.WorkflowService;
import io.celox.taskflow.task.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WorkflowController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class WorkflowControllerTest {

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private UserService userService;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WorkflowService workflowService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldGetAllWorkflows() throws Exception {
        // Given
        WorkflowDto workflow1 = WorkflowDto.builder()
                .id(UUID.randomUUID())
                .name("Workflow 1")
                .status(WorkflowStatus.ACTIVE)
                .build();

        WorkflowDto workflow2 = WorkflowDto.builder()
                .id(UUID.randomUUID())
                .name("Workflow 2")
                .status(WorkflowStatus.DRAFT)
                .build();

        List<WorkflowDto> workflows = Arrays.asList(workflow1, workflow2);

        when(workflowService.getAllWorkflows()).thenReturn(workflows);

        // When & Then
        mockMvc.perform(get("/api/v1/workflows"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Workflow 1"))
                .andExpect(jsonPath("$[1].name").value("Workflow 2"));
    }

    @Test
    void shouldGetWorkflowById() throws Exception {
        // Given
        UUID workflowId = UUID.randomUUID();
        WorkflowDto workflow = WorkflowDto.builder()
                .id(workflowId)
                .name("Test Workflow")
                .status(WorkflowStatus.ACTIVE)
                .build();

        when(workflowService.getWorkflowById(workflowId)).thenReturn(workflow);

        // When & Then
        mockMvc.perform(get("/api/v1/workflows/{id}", workflowId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(workflowId.toString()))
                .andExpect(jsonPath("$.name").value("Test Workflow"));
    }

    @Test
    void shouldCreateWorkflow() throws Exception {
        // Given
        UUID ownerId = UUID.randomUUID();
        CreateWorkflowDto createDto = CreateWorkflowDto.builder()
                .name("New Workflow")
                .description("Workflow Description")
                .build();

        UUID workflowId = UUID.randomUUID();
        WorkflowDto createdWorkflow = WorkflowDto.builder()
                .id(workflowId)
                .name("New Workflow")
                .status(WorkflowStatus.DRAFT)
                .build();

        when(workflowService.createWorkflow(eq(ownerId), any(CreateWorkflowDto.class))).thenReturn(createdWorkflow);

        // When & Then
        mockMvc.perform(post("/api/v1/workflows")
                        .param("ownerId", ownerId.toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(workflowId.toString()))
                .andExpect(jsonPath("$.name").value("New Workflow"));
    }

    @Test
    void shouldUpdateWorkflow() throws Exception {
        // Given
        UUID workflowId = UUID.randomUUID();
        UpdateWorkflowDto updateDto = UpdateWorkflowDto.builder()
                .name("Updated Workflow")
                .build();

        WorkflowDto updatedWorkflow = WorkflowDto.builder()
                .id(workflowId)
                .name("Updated Workflow")
                .build();

        when(workflowService.updateWorkflow(eq(workflowId), any(UpdateWorkflowDto.class))).thenReturn(updatedWorkflow);

        // When & Then
        mockMvc.perform(put("/api/v1/workflows/{id}", workflowId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Workflow"));
    }

    @Test
    void shouldActivateWorkflow() throws Exception {
        // Given
        UUID workflowId = UUID.randomUUID();
        WorkflowDto activatedWorkflow = WorkflowDto.builder()
                .id(workflowId)
                .status(WorkflowStatus.ACTIVE)
                .build();

        when(workflowService.activateWorkflow(workflowId)).thenReturn(activatedWorkflow);

        // When & Then
        mockMvc.perform(post("/api/v1/workflows/{id}/activate", workflowId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    void shouldDeactivateWorkflow() throws Exception {
        // Given
        UUID workflowId = UUID.randomUUID();
        WorkflowDto deactivatedWorkflow = WorkflowDto.builder()
                .id(workflowId)
                .status(WorkflowStatus.DRAFT)
                .build();

        when(workflowService.deactivateWorkflow(workflowId)).thenReturn(deactivatedWorkflow);

        // When & Then
        mockMvc.perform(post("/api/v1/workflows/{id}/deactivate", workflowId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DRAFT"));
    }

    @Test
    void shouldExecuteWorkflow() throws Exception {
        // Given
        UUID workflowId = UUID.randomUUID();
        Map<String, Object> triggerData = new HashMap<>();
        triggerData.put("key", "value");

        WorkflowExecutionDto execution = WorkflowExecutionDto.builder()
                .id(UUID.randomUUID())
                .workflowId(workflowId)
                .status(ExecutionStatus.RUNNING)
                .build();

        when(workflowService.executeWorkflow(eq(workflowId), any(Map.class))).thenReturn(execution);

        // When & Then
        mockMvc.perform(post("/api/v1/workflows/{id}/execute", workflowId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(triggerData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.workflowId").value(workflowId.toString()));
    }

    @Test
    void shouldDeleteWorkflow() throws Exception {
        // Given
        UUID workflowId = UUID.randomUUID();
        doNothing().when(workflowService).deleteWorkflow(workflowId);

        // When & Then
        mockMvc.perform(delete("/api/v1/workflows/{id}", workflowId))
                .andExpect(status().isNoContent());

        verify(workflowService, times(1)).deleteWorkflow(workflowId);
    }
}
