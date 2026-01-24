package io.celox.taskflow.shared.events;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = TaskCreatedEvent.class, name = "TASK_CREATED"),
    @JsonSubTypes.Type(value = TaskUpdatedEvent.class, name = "TASK_UPDATED"),
    @JsonSubTypes.Type(value = TaskCompletedEvent.class, name = "TASK_COMPLETED"),
    @JsonSubTypes.Type(value = TaskDeletedEvent.class, name = "TASK_DELETED")
})
public abstract class TaskEvent {
    private UUID eventId;
    private LocalDateTime timestamp;
    private String eventType;

    public TaskEvent(String eventType) {
        this.eventId = UUID.randomUUID();
        this.timestamp = LocalDateTime.now();
        this.eventType = eventType;
    }
}
