package io.celox.taskflow.task.service;

import io.celox.taskflow.task.domain.User;
import io.celox.taskflow.task.domain.Workflow;
import io.celox.taskflow.task.domain.WorkflowStatus;
import io.celox.taskflow.task.domain.WorkflowExecution;
import io.celox.taskflow.task.dto.CreateWorkflowDto;
import io.celox.taskflow.task.dto.UpdateWorkflowDto;
import io.celox.taskflow.task.dto.WorkflowDto;
import io.celox.taskflow.task.dto.WorkflowExecutionDto;
import io.celox.taskflow.task.exception.ResourceNotFoundException;
import io.celox.taskflow.task.mapper.WorkflowMapper;
import io.celox.taskflow.task.repository.UserRepository;
import io.celox.taskflow.task.repository.WorkflowRepository;
import io.celox.taskflow.task.repository.WorkflowExecutionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkflowService {

    private final WorkflowRepository workflowRepository;
    private final WorkflowExecutionRepository executionRepository;
    private final UserRepository userRepository;
    private final WorkflowMapper workflowMapper;

    @Transactional(readOnly = true)
    public List<WorkflowDto> getAllWorkflows() {
        log.debug("Fetching all workflows");
        return workflowRepository.findAll().stream()
                .map(workflowMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WorkflowDto> getWorkflowsByOwner(UUID ownerId) {
        log.debug("Fetching workflows for owner: {}", ownerId);
        return workflowRepository.findByOwnerId(ownerId).stream()
                .map(workflowMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WorkflowDto getWorkflowById(UUID id) {
        log.debug("Fetching workflow with id: {}", id);
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workflow not found with id: " + id));
        return workflowMapper.toDto(workflow);
    }

    @Transactional
    public WorkflowDto createWorkflow(UUID ownerId, CreateWorkflowDto dto) {
        log.info("Creating new workflow: {}", dto.getName());

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + ownerId));

        Workflow workflow = workflowMapper.toEntity(dto);
        workflow.setOwner(owner);

        Workflow savedWorkflow = workflowRepository.save(workflow);

        log.info("Workflow created successfully with id: {}", savedWorkflow.getId());
        return workflowMapper.toDto(savedWorkflow);
    }

    @Transactional
    public WorkflowDto updateWorkflow(UUID id, UpdateWorkflowDto dto) {
        log.info("Updating workflow with id: {}", id);

        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workflow not found with id: " + id));

        workflowMapper.updateEntity(workflow, dto);

        Workflow savedWorkflow = workflowRepository.save(workflow);

        log.info("Workflow updated successfully with id: {}", savedWorkflow.getId());
        return workflowMapper.toDto(savedWorkflow);
    }

    @Transactional
    public WorkflowDto activateWorkflow(UUID id) {
        log.info("Activating workflow with id: {}", id);

        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workflow not found with id: " + id));

        workflow.setStatus(WorkflowStatus.ACTIVE);
        Workflow savedWorkflow = workflowRepository.save(workflow);

        log.info("Workflow activated successfully with id: {}", savedWorkflow.getId());
        return workflowMapper.toDto(savedWorkflow);
    }

    @Transactional
    public WorkflowDto deactivateWorkflow(UUID id) {
        log.info("Deactivating workflow with id: {}", id);

        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workflow not found with id: " + id));

        workflow.setStatus(WorkflowStatus.DRAFT);
        Workflow savedWorkflow = workflowRepository.save(workflow);

        log.info("Workflow deactivated successfully with id: {}", savedWorkflow.getId());
        return workflowMapper.toDto(savedWorkflow);
    }

    @Transactional
    public void deleteWorkflow(UUID id) {
        log.info("Deleting workflow with id: {}", id);

        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workflow not found with id: " + id));

        workflowRepository.delete(workflow);
        log.info("Workflow deleted successfully with id: {}", id);
    }

    @Transactional(readOnly = true)
    public List<WorkflowExecutionDto> getWorkflowExecutions(UUID workflowId) {
        log.debug("Fetching executions for workflow: {}", workflowId);
        return executionRepository.findByWorkflowId(workflowId).stream()
                .map(workflowMapper::toExecutionDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WorkflowExecutionDto getExecutionById(UUID executionId) {
        log.debug("Fetching execution with id: {}", executionId);
        WorkflowExecution execution = executionRepository.findById(executionId)
                .orElseThrow(() -> new ResourceNotFoundException("Execution not found with id: " + executionId));
        return workflowMapper.toExecutionDto(execution);
    }
}
