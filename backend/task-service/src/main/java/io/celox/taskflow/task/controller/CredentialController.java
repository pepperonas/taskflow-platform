package io.celox.taskflow.task.controller;

import io.celox.taskflow.task.domain.Credential;
import io.celox.taskflow.task.dto.CreateCredentialDto;
import io.celox.taskflow.task.dto.CredentialDto;
import io.celox.taskflow.task.dto.UserDto;
import io.celox.taskflow.task.service.CredentialService;
import io.celox.taskflow.task.service.UserService;
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
    private final UserService userService;

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
     * Extract user ID from JWT token.
     * The token contains the username, so we need to look up the user to get the UUID.
     */
    private UUID extractUserIdFromToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalStateException("User not authenticated");
        }

        String username = authentication.getName();
        
        // First try to parse as UUID (in case it's already a UUID)
        try {
            return UUID.fromString(username);
        } catch (IllegalArgumentException e) {
            // Not a UUID, so it's a username - look up the user
            log.debug("Looking up user by username: {}", username);
        }
        
        try {
            UserDto user = userService.getUserByUsername(username);
            return user.getId();
        } catch (Exception e) {
            log.error("Failed to find user by username: {}", username, e);
            throw new IllegalStateException("User not found: " + username);
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
