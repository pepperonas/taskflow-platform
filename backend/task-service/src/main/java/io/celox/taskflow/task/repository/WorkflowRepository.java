package io.celox.taskflow.task.repository;

import io.celox.taskflow.task.domain.Workflow;
import io.celox.taskflow.task.domain.WorkflowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, UUID> {

    List<Workflow> findByOwnerId(UUID ownerId);

    List<Workflow> findByStatus(WorkflowStatus status);

    List<Workflow> findByOwnerIdAndStatus(UUID ownerId, WorkflowStatus status);
}
