package io.celox.taskflow.task.mapper;

import io.celox.taskflow.task.domain.Task;
import io.celox.taskflow.task.domain.User;
import io.celox.taskflow.task.dto.CreateTaskDto;
import io.celox.taskflow.task.dto.TaskDto;
import io.celox.taskflow.task.dto.UpdateTaskDto;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TaskMapper {

    @Mapping(target = "assigneeId", source = "assignee.id")
    @Mapping(target = "assigneeName", expression = "java(getAssigneeName(task))")
    TaskDto toDto(Task task);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "assignee", ignore = true)
    @Mapping(target = "status", constant = "OPEN")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "completedAt", ignore = true)
    Task toEntity(CreateTaskDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "assignee", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "completedAt", ignore = true)
    void updateEntity(@MappingTarget Task task, UpdateTaskDto dto);

    default String getAssigneeName(Task task) {
        if (task.getAssignee() == null) {
            return null;
        }
        User assignee = task.getAssignee();
        if (assignee.getFirstName() != null && assignee.getLastName() != null) {
            return assignee.getFirstName() + " " + assignee.getLastName();
        }
        return assignee.getUsername();
    }
}
