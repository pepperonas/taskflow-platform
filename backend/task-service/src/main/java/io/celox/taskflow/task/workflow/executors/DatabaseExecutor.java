package io.celox.taskflow.task.workflow.executors;

import io.celox.taskflow.task.workflow.ExecutionContext;
import io.celox.taskflow.task.workflow.NodeExecutor;
import io.celox.taskflow.task.workflow.WorkflowNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseExecutor implements NodeExecutor {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public Object execute(WorkflowNode node, ExecutionContext context) {
        Map<String, Object> data = node.getData();

        context.log("Executing Database node: " + node.getId());

        String query = resolveTemplate((String) data.get("query"), context);
        String operation = (String) data.getOrDefault("operation", "select");

        if (query == null || query.trim().isEmpty()) {
            context.log("WARNING: No query specified");
            return Map.of("error", "No query specified");
        }

        try {
            if ("select".equalsIgnoreCase(operation)) {
                List<Map<String, Object>> results = jdbcTemplate.queryForList(query);

                Map<String, Object> result = new HashMap<>();
                result.put("rows", results);
                result.put("count", results.size());

                context.log("Query returned " + results.size() + " rows");
                context.setVariable(node.getId() + "_result", result);

                return result;

            } else {
                // INSERT, UPDATE, DELETE
                int affectedRows = jdbcTemplate.update(query);

                Map<String, Object> result = new HashMap<>();
                result.put("affectedRows", affectedRows);

                context.log("Query affected " + affectedRows + " rows");
                context.setVariable(node.getId() + "_result", result);

                return result;
            }

        } catch (Exception e) {
            log.error("Database query failed", e);
            context.log("ERROR: Database query failed - " + e.getMessage());

            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("error", e.getMessage());

            return errorResult;
        }
    }

    @Override
    public String getNodeType() {
        return "database";
    }

    private String resolveTemplate(String template, ExecutionContext context) {
        if (template == null) {
            return null;
        }

        String result = template;

        if (template.contains("{{")) {
            for (Map.Entry<String, Object> entry : context.getVariables().entrySet()) {
                String placeholder = "{{" + entry.getKey() + "}}";
                if (result.contains(placeholder)) {
                    result = result.replace(placeholder, String.valueOf(entry.getValue()));
                }
            }

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
