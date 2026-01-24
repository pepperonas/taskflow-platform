package io.celox.taskflow.task.mapper;

import io.celox.taskflow.task.domain.Workflow;
import io.celox.taskflow.task.domain.WorkflowExecution;
import io.celox.taskflow.task.dto.CreateWorkflowDto;
import io.celox.taskflow.task.dto.UpdateWorkflowDto;
import io.celox.taskflow.task.dto.WorkflowDto;
import io.celox.taskflow.task.dto.WorkflowExecutionDto;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {UserMapper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface WorkflowMapper {

    WorkflowDto toDto(Workflow workflow);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "status", constant = "DRAFT")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Workflow toEntity(CreateWorkflowDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(@MappingTarget Workflow workflow, UpdateWorkflowDto dto);

    @Mapping(target = "workflowId", source = "workflow.id")
    @Mapping(target = "workflowName", source = "workflow.name")
    WorkflowExecutionDto toExecutionDto(WorkflowExecution execution);
}
