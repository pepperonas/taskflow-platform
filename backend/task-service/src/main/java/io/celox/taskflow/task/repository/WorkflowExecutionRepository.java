package io.celox.taskflow.task.repository;

import io.celox.taskflow.task.domain.WorkflowExecution;
import io.celox.taskflow.task.domain.ExecutionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkflowExecutionRepository extends JpaRepository<WorkflowExecution, UUID> {

    List<WorkflowExecution> findByWorkflowId(UUID workflowId);

    List<WorkflowExecution> findByWorkflowIdAndStatus(UUID workflowId, ExecutionStatus status);

    List<WorkflowExecution> findByStatus(ExecutionStatus status);
}
