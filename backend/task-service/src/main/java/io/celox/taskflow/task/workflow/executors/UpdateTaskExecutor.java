package io.celox.taskflow.task.workflow.executors;

import io.celox.taskflow.task.domain.TaskStatus;
import io.celox.taskflow.task.dto.TaskDto;
import io.celox.taskflow.task.dto.UpdateTaskDto;
import io.celox.taskflow.task.service.TaskService;
import io.celox.taskflow.task.workflow.ExecutionContext;
import io.celox.taskflow.task.workflow.NodeExecutor;
import io.celox.taskflow.task.workflow.WorkflowNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class UpdateTaskExecutor implements NodeExecutor {

    private final TaskService taskService;

    @Override
    public Object execute(WorkflowNode node, ExecutionContext context) {
        Map<String, Object> data = node.getData();

        context.log("Executing UpdateTask node: " + node.getId());

        // Get task ID from node data or context
        String taskIdStr = (String) data.get("taskId");
        if (taskIdStr == null) {
            taskIdStr = (String) context.getVariable("taskId");
        }

        if (taskIdStr == null) {
            throw new IllegalArgumentException("Task ID not provided in UpdateTask node");
        }

        UUID taskId = UUID.fromString(taskIdStr);

        // Build update DTO
        UpdateTaskDto updateDto = new UpdateTaskDto();

        if (data.containsKey("status")) {
            updateDto.setStatus(TaskStatus.valueOf((String) data.get("status")));
        }

        if (data.containsKey("title")) {
            updateDto.setTitle((String) data.get("title"));
        }

        if (data.containsKey("description")) {
            updateDto.setDescription((String) data.get("description"));
        }

        // Update the task
        TaskDto updatedTask = taskService.updateTask(taskId, updateDto);

        context.log("Updated task: " + updatedTask.getTitle() + " (ID: " + updatedTask.getId() + ")");
        context.setVariable(node.getId() + "_result", updatedTask);

        return updatedTask;
    }

    @Override
    public String getNodeType() {
        return "updateTask";
    }
}
