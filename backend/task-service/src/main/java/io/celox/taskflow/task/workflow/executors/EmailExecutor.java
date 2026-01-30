package io.celox.taskflow.task.workflow.executors;

import io.celox.taskflow.task.workflow.ExecutionContext;
import io.celox.taskflow.task.workflow.NodeExecutor;
import io.celox.taskflow.task.workflow.WorkflowNode;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailExecutor implements NodeExecutor {

    private final JavaMailSender mailSender;

    @Override
    public Object execute(WorkflowNode node, ExecutionContext context) {
        Map<String, Object> data = node.getData();

        log.info("=== EMAIL EXECUTOR: Starting execution for node {} ===", node.getId());
        context.log("Executing Email node: " + node.getId());

        // Support both config.* structure (from frontend) and direct properties
        Map<String, Object> config = (Map<String, Object>) data.get("config");
        if (config == null) {
            config = data; // Fallback to direct properties
        }

        log.info("Email node config: {}", config);
        
        String to = resolveTemplate((String) config.get("to"), context);
        String subject = resolveTemplate((String) config.get("subject"), context);
        String body = resolveTemplate((String) config.get("body"), context);
        String from = (String) config.getOrDefault("from", "martin.pfeffer@celox.io");
        
        log.info("Resolved email fields - To: {}, Subject: {}, From: {}", to, subject, from);

        if (to == null || to.trim().isEmpty()) {
            context.log("WARNING: No recipient email address specified");
            return Map.of("sent", false, "error", "No recipient specified");
        }

        try {
            log.info("Attempting to send email to: {}, subject: {}", to, subject);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject != null ? subject : "Notification from TaskFlow");
            helper.setText(body != null ? body : "", true); // HTML
            helper.setFrom(from);

            log.info("Sending email via JavaMailSender...");
            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);

            Map<String, Object> result = new HashMap<>();
            result.put("sent", true);
            result.put("to", to);
            result.put("subject", subject);

            context.log("Email sent successfully to: " + to);
            context.setVariable(node.getId() + "_result", result);

            return result;

        } catch (jakarta.mail.MessagingException e) {
            log.error("MessagingException while sending email to {}: {}", to, e.getMessage(), e);
            context.log("ERROR: Failed to send email - " + e.getMessage());
            
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("sent", false);
            errorResult.put("error", "Email sending failed: " + e.getMessage());
            if (e.getCause() != null) {
                errorResult.put("cause", e.getCause().getMessage());
            }

            return errorResult;
        } catch (Exception e) {
            log.error("Unexpected error while sending email to {}: {}", to, e.getMessage(), e);
            context.log("ERROR: Failed to send email - " + e.getMessage());

            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("sent", false);
            errorResult.put("error", e.getMessage());
            if (e.getCause() != null) {
                errorResult.put("cause", e.getCause().getMessage());
            }

            return errorResult;
        }
    }

    @Override
    public String getNodeType() {
        return "email";
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
