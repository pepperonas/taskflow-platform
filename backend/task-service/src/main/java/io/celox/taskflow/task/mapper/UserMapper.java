package io.celox.taskflow.task.mapper;

import io.celox.taskflow.task.domain.User;
import io.celox.taskflow.task.dto.RegisterDto;
import io.celox.taskflow.task.dto.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", constant = "USER")
    @Mapping(target = "enabled", constant = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    User toEntity(RegisterDto dto);
}
