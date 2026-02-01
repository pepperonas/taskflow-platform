package io.celox.taskflow.task.controller;

import io.celox.taskflow.task.domain.Credential;
import io.celox.taskflow.task.dto.CreateCredentialDto;
import io.celox.taskflow.task.dto.CredentialDto;
import io.celox.taskflow.task.service.CredentialService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/credentials")
@RequiredArgsConstructor
@Slf4j
public class CredentialController {

    private final CredentialService credentialService;

    @PostMapping
    public ResponseEntity<CredentialDto> createCredential(@Valid @RequestBody CreateCredentialDto request) {
        UUID ownerId = extractUserIdFromToken();
        log.info("Creating credential: {} for user: {}", request.getName(), ownerId);

        Credential credential = credentialService.createCredential(
                request.getName(),
                request.getType(),
                request.getData(),
                ownerId
        );

        return ResponseEntity.ok(toDto(credential));
    }

    @GetMapping
    public ResponseEntity<List<CredentialDto>> listCredentials() {
        UUID ownerId = extractUserIdFromToken();
        log.info("Listing credentials for user: {}", ownerId);

        List<Credential> credentials = credentialService.findByOwnerId(ownerId);
        List<CredentialDto> dtos = credentials.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CredentialDto> getCredential(@PathVariable UUID id) {
        UUID ownerId = extractUserIdFromToken();
        log.info("Getting credential: {} for user: {}", id, ownerId);

        Credential credential = credentialService.findById(id, ownerId);
        return ResponseEntity.ok(toDto(credential));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCredential(@PathVariable UUID id) {
        UUID ownerId = extractUserIdFromToken();
        log.info("Deleting credential: {} for user: {}", id, ownerId);

        credentialService.deleteCredential(id, ownerId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Extract user ID from JWT token
     */
    private UUID extractUserIdFromToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalStateException("User not authenticated");
        }

        try {
            return UUID.fromString(authentication.getName());
        } catch (IllegalArgumentException e) {
            log.error("Invalid user ID in token: {}", authentication.getName());
            throw new IllegalStateException("Invalid user ID in token");
        }
    }

    /**
     * Convert entity to DTO
     */
    private CredentialDto toDto(Credential credential) {
        return CredentialDto.builder()
                .id(credential.getId())
                .name(credential.getName())
                .type(credential.getType())
                .createdAt(credential.getCreatedAt())
                .build();
    }
}
