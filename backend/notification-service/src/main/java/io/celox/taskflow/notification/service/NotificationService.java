package io.celox.taskflow.notification.service;

import io.celox.taskflow.shared.events.TaskCompletedEvent;
import io.celox.taskflow.shared.events.TaskCreatedEvent;
import io.celox.taskflow.shared.events.TaskDeletedEvent;
import io.celox.taskflow.shared.events.TaskUpdatedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class NotificationService {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public void notifyTaskCreated(TaskCreatedEvent event) {
        log.info("╔══════════════════════════════════════════════════════════════╗");
        log.info("║              📝 NEW TASK CREATED                             ║");
        log.info("╠══════════════════════════════════════════════════════════════╣");
        log.info("║ Task ID:    {}", String.format("%-45s", event.getTaskId()) + "║");
        log.info("║ Title:      {}", String.format("%-45s", truncate(event.getTitle(), 45)) + "║");
        log.info("║ Priority:   {}", String.format("%-45s", event.getPriority()) + "║");
        log.info("║ Status:     {}", String.format("%-45s", event.getStatus()) + "║");
        if (event.getDueDate() != null) {
            log.info("║ Due Date:   {}", String.format("%-45s", event.getDueDate().format(formatter)) + "║");
        }
        log.info("╚══════════════════════════════════════════════════════════════╝");

        // Simulate notification sending
        sendEmailNotification("Task Created", "A new task '" + event.getTitle() + "' has been created.");
    }

    public void notifyTaskUpdated(TaskUpdatedEvent event) {
        log.info("╔══════════════════════════════════════════════════════════════╗");
        log.info("║              ✏️  TASK UPDATED                                 ║");
        log.info("╠══════════════════════════════════════════════════════════════╣");
        log.info("║ Task ID:    {}", String.format("%-45s", event.getTaskId()) + "║");
        log.info("║ Title:      {}", String.format("%-45s", truncate(event.getTitle(), 45)) + "║");
        log.info("║ Status:     {}", String.format("%-45s", event.getStatus()) + "║");
        log.info("║ Priority:   {}", String.format("%-45s", event.getPriority()) + "║");
        log.info("╚══════════════════════════════════════════════════════════════╝");

        sendEmailNotification("Task Updated", "Task '" + event.getTitle() + "' has been updated.");
    }

    public void notifyTaskCompleted(TaskCompletedEvent event) {
        log.info("╔══════════════════════════════════════════════════════════════╗");
        log.info("║              ✅ TASK COMPLETED                                ║");
        log.info("╠══════════════════════════════════════════════════════════════╣");
        log.info("║ Task ID:    {}", String.format("%-45s", event.getTaskId()) + "║");
        log.info("║ Title:      {}", String.format("%-45s", truncate(event.getTitle(), 45)) + "║");
        log.info("║ 🎉 Congratulations! Task has been marked as completed!      ║");
        log.info("╚══════════════════════════════════════════════════════════════╝");

        sendEmailNotification("Task Completed", "Congratulations! Task '" + event.getTitle() + "' has been completed.");
    }

    public void notifyTaskDeleted(TaskDeletedEvent event) {
        log.info("╔══════════════════════════════════════════════════════════════╗");
        log.info("║              🗑️  TASK DELETED                                 ║");
        log.info("╠══════════════════════════════════════════════════════════════╣");
        log.info("║ Task ID:    {}", String.format("%-45s", event.getTaskId()) + "║");
        log.info("║ Title:      {}", String.format("%-45s", truncate(event.getTitle(), 45)) + "║");
        log.info("╚══════════════════════════════════════════════════════════════╝");

        sendEmailNotification("Task Deleted", "Task '" + event.getTitle() + "' has been deleted.");
    }

    private void sendEmailNotification(String subject, String message) {
        // Simulate email sending (in production, integrate with SMTP or email service)
        log.info("📧 [EMAIL] Subject: {} | Message: {}", subject, message);
    }

    private String truncate(String str, int maxLength) {
        if (str == null) return "";
        return str.length() <= maxLength ? str : str.substring(0, maxLength - 3) + "...";
    }
}
