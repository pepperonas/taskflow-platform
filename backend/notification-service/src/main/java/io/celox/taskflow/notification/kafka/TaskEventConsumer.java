package io.celox.taskflow.notification.kafka;

import io.celox.taskflow.notification.service.NotificationService;
import io.celox.taskflow.shared.events.TaskCompletedEvent;
import io.celox.taskflow.shared.events.TaskCreatedEvent;
import io.celox.taskflow.shared.events.TaskDeletedEvent;
import io.celox.taskflow.shared.events.TaskUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TaskEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = "task.created", groupId = "${spring.kafka.consumer.group-id}")
    public void handleTaskCreated(TaskCreatedEvent event) {
        log.info("Received TaskCreatedEvent for task: {}", event.getTaskId());
        notificationService.notifyTaskCreated(event);
    }

    @KafkaListener(topics = "task.updated", groupId = "${spring.kafka.consumer.group-id}")
    public void handleTaskUpdated(TaskUpdatedEvent event) {
        log.info("Received TaskUpdatedEvent for task: {}", event.getTaskId());
        notificationService.notifyTaskUpdated(event);
    }

    @KafkaListener(topics = "task.completed", groupId = "${spring.kafka.consumer.group-id}")
    public void handleTaskCompleted(TaskCompletedEvent event) {
        log.info("Received TaskCompletedEvent for task: {}", event.getTaskId());
        notificationService.notifyTaskCompleted(event);
    }

    @KafkaListener(topics = "task.deleted", groupId = "${spring.kafka.consumer.group-id}")
    public void handleTaskDeleted(TaskDeletedEvent event) {
        log.info("Received TaskDeletedEvent for task: {}", event.getTaskId());
        notificationService.notifyTaskDeleted(event);
    }
}
