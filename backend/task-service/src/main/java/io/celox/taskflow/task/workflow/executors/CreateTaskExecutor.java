package io.celox.taskflow.task.workflow.executors;

import io.celox.taskflow.task.domain.TaskCategory;
import io.celox.taskflow.task.domain.TaskPriority;
import io.celox.taskflow.task.dto.CreateTaskDto;
import io.celox.taskflow.task.dto.TaskDto;
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
public class CreateTaskExecutor implements NodeExecutor {

    private final TaskService taskService;

    @Override
    public Object execute(WorkflowNode node, ExecutionContext context) {
        Map<String, Object> data = node.getData();

        context.log("Executing CreateTask node: " + node.getId());

        // Extract task data from node configuration
        String title = resolveTemplate((String) data.get("title"), context);
        String description = resolveTemplate((String) data.get("description"), context);
        String priority = (String) data.getOrDefault("priority", "MEDIUM");
        String category = (String) data.getOrDefault("category", "WORK");

        // Create task DTO
        CreateTaskDto createTaskDto = CreateTaskDto.builder()
                .title(title)
                .description(description)
                .priority(TaskPriority.valueOf(priority))
                .category(TaskCategory.valueOf(category))
                .build();

        // Check if assigneeId is provided
        if (data.containsKey("assigneeId")) {
            String assigneeId = (String) data.get("assigneeId");
            createTaskDto.setAssigneeId(UUID.fromString(assigneeId));
        }

        // Create the task
        TaskDto createdTask = taskService.createTask(createTaskDto);

        context.log("Created task: " + createdTask.getTitle() + " (ID: " + createdTask.getId() + ")");
        context.setVariable(node.getId() + "_result", createdTask);

        return createdTask;
    }

    @Override
    public String getNodeType() {
        return "createTask";
    }

    /**
     * Resolve template variables like {{variableName}}
     */
    private String resolveTemplate(String template, ExecutionContext context) {
        if (template == null) {
            return null;
        }

        String result = template;

        // Replace {{variable}} with actual values from context
        if (template.contains("{{")) {
            for (Map.Entry<String, Object> entry : context.getVariables().entrySet()) {
                String placeholder = "{{" + entry.getKey() + "}}";
                if (result.contains(placeholder)) {
                    result = result.replace(placeholder, String.valueOf(entry.getValue()));
                }
            }

            // Also check trigger data
            for (Map.Entry<String, Object> entry : context.getTriggerData().entrySet()) {
                String placeholder = "{{" + entry.getKey() + "}}";
                if (result.contains(placeholder)) {
                    result = result.replace(placeholder, String.valueOf(entry.getValue()));
                }
            }
        }

        return result;
    }
}
