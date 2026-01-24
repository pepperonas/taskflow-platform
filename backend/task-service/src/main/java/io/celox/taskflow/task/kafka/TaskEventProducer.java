package io.celox.taskflow.task.kafka;

import io.celox.taskflow.shared.events.TaskCompletedEvent;
import io.celox.taskflow.shared.events.TaskCreatedEvent;
import io.celox.taskflow.shared.events.TaskDeletedEvent;
import io.celox.taskflow.shared.events.TaskUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TaskEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TASK_CREATED_TOPIC = "task.created";
    private static final String TASK_UPDATED_TOPIC = "task.updated";
    private static final String TASK_COMPLETED_TOPIC = "task.completed";
    private static final String TASK_DELETED_TOPIC = "task.deleted";

    public void sendTaskCreatedEvent(TaskCreatedEvent event) {
        log.info("Publishing TaskCreatedEvent for task: {}", event.getTaskId());
        kafkaTemplate.send(TASK_CREATED_TOPIC, event.getTaskId().toString(), event);
    }

    public void sendTaskUpdatedEvent(TaskUpdatedEvent event) {
        log.info("Publishing TaskUpdatedEvent for task: {}", event.getTaskId());
        kafkaTemplate.send(TASK_UPDATED_TOPIC, event.getTaskId().toString(), event);
    }

    public void sendTaskCompletedEvent(TaskCompletedEvent event) {
        log.info("Publishing TaskCompletedEvent for task: {}", event.getTaskId());
        kafkaTemplate.send(TASK_COMPLETED_TOPIC, event.getTaskId().toString(), event);
    }

    public void sendTaskDeletedEvent(TaskDeletedEvent event) {
        log.info("Publishing TaskDeletedEvent for task: {}", event.getTaskId());
        kafkaTemplate.send(TASK_DELETED_TOPIC, event.getTaskId().toString(), event);
    }
}
