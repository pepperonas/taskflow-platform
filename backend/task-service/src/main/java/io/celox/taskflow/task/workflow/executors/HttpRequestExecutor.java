package io.celox.taskflow.task.workflow.executors;

import io.celox.taskflow.task.workflow.ExecutionContext;
import io.celox.taskflow.task.workflow.NodeExecutor;
import io.celox.taskflow.task.workflow.WorkflowNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class HttpRequestExecutor implements NodeExecutor {

    private final RestTemplate restTemplate;

    @Override
    public Object execute(WorkflowNode node, ExecutionContext context) {
        Map<String, Object> data = node.getData();

        context.log("Executing HttpRequest node: " + node.getId());

        // Extract configuration
        String url = resolveTemplate((String) data.get("url"), context);
        String method = (String) data.getOrDefault("method", "GET");

        context.log("HTTP Request: " + method + " " + url);

        // Build headers
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        // Add custom headers
        if (data.containsKey("headers")) {
            @SuppressWarnings("unchecked")
            List<Map<String, String>> headersList = (List<Map<String, String>>) data.get("headers");
            if (headersList != null) {
                for (Map<String, String> header : headersList) {
                    String key = header.get("key");
                    String value = resolveTemplate(header.get("value"), context);
                    if (key != null && !key.isEmpty() && value != null) {
                        httpHeaders.set(key, value);
                    }
                }
            }
        }

        // Prepare request body
        Object body = null;
        if (data.containsKey("body") && data.get("body") != null) {
            String bodyTemplate = (String) data.get("body");
            body = resolveTemplate(bodyTemplate, context);
        }

        HttpEntity<Object> entity = new HttpEntity<>(body, httpHeaders);

        try {
            ResponseEntity<Map> response;

            switch (method.toUpperCase()) {
                case "POST":
                    response = restTemplate.postForEntity(url, entity, Map.class);
                    break;
                case "PUT":
                    response = restTemplate.exchange(url, HttpMethod.PUT, entity, Map.class);
                    break;
                case "PATCH":
                    response = restTemplate.exchange(url, HttpMethod.PATCH, entity, Map.class);
                    break;
                case "DELETE":
                    response = restTemplate.exchange(url, HttpMethod.DELETE, entity, Map.class);
                    break;
                case "GET":
                default:
                    response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
                    break;
            }

            // Build result object
            Map<String, Object> result = new HashMap<>();
            result.put("statusCode", response.getStatusCode().value());
            result.put("headers", response.getHeaders().toSingleValueMap());
            result.put("body", response.getBody());

            context.log("HTTP Request successful - Status: " + response.getStatusCode().value());
            context.setVariable(node.getId() + "_result", result);

            return result;

        } catch (Exception e) {
            log.error("HTTP Request failed", e);
            context.log("HTTP Request failed: " + e.getMessage());

            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("error", true);
            errorResult.put("message", e.getMessage());
            errorResult.put("statusCode", 0);

            return errorResult;
        }
    }

    @Override
    public String getNodeType() {
        return "httpRequest";
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
