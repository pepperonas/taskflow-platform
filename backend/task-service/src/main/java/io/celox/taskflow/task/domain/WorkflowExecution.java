package io.celox.taskflow.task.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "workflow_executions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowExecution {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    private Workflow workflow;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ExecutionStatus status = ExecutionStatus.RUNNING;

    @Column(name = "execution_log", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String executionLog;

    @Column(name = "error_details", columnDefinition = "text")
    private String errorDetails;

    @Column(name = "executed_at", nullable = false)
    private LocalDateTime executedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
