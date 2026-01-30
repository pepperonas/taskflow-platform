package io.celox.taskflow.task.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CredentialDto {
    private UUID id;
    private String name;
    private String type;
    private LocalDateTime createdAt;
    // Note: encryptedData is NOT exposed via DTO for security
}
