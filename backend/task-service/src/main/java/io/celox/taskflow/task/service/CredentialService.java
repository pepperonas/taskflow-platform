package io.celox.taskflow.task.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.celox.taskflow.task.domain.Credential;
import io.celox.taskflow.task.repository.CredentialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CredentialService {

    private final CredentialRepository credentialRepository;
    private final ObjectMapper objectMapper;

    @Value("${security.encryption.key:your-32-character-secret-key!!}")
    private String encryptionKey;

    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;

    @Transactional
    public Credential createCredential(String name, String type, Map<String, String> data, UUID ownerId) {
        log.info("Creating credential: {} for owner: {}", name, ownerId);

        String encryptedData = encrypt(data);

        Credential credential = Credential.builder()
                .name(name)
                .type(type)
                .encryptedData(encryptedData)
                .ownerId(ownerId)
                .build();

        return credentialRepository.save(credential);
    }

    @Transactional(readOnly = true)
    public List<Credential> findByOwnerId(UUID ownerId) {
        return credentialRepository.findByOwnerId(ownerId);
    }

    @Transactional(readOnly = true)
    public Credential findById(UUID id, UUID ownerId) {
        return credentialRepository.findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Credential not found: " + id));
    }

    @Transactional(readOnly = true)
    public Map<String, String> getDecryptedData(UUID id, UUID ownerId) {
        Credential credential = findById(id, ownerId);
        return decrypt(credential.getEncryptedData());
    }

    @Transactional
    public void deleteCredential(UUID id, UUID ownerId) {
        credentialRepository.deleteByIdAndOwnerId(id, ownerId);
        log.info("Deleted credential: {} for owner: {}", id, ownerId);
    }

    /**
     * Encrypt credential data using AES-GCM
     */
    private String encrypt(Map<String, String> data) {
        try {
            // Convert data to JSON
            String json = objectMapper.writeValueAsString(data);
            byte[] plaintext = json.getBytes(StandardCharsets.UTF_8);

            // Generate random IV
            byte[] iv = new byte[GCM_IV_LENGTH];
            new SecureRandom().nextBytes(iv);

            // Create cipher
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            SecretKeySpec keySpec = new SecretKeySpec(getKeyBytes(), "AES");
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, gcmSpec);

            // Encrypt
            byte[] ciphertext = cipher.doFinal(plaintext);

            // Combine IV + ciphertext
            ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + ciphertext.length);
            byteBuffer.put(iv);
            byteBuffer.put(ciphertext);

            // Encode to Base64
            return Base64.getEncoder().encodeToString(byteBuffer.array());

        } catch (Exception e) {
            log.error("Encryption failed", e);
            throw new RuntimeException("Encryption failed", e);
        }
    }

    /**
     * Decrypt credential data using AES-GCM
     */
    private Map<String, String> decrypt(String encryptedData) {
        try {
            // Decode from Base64
            byte[] decodedData = Base64.getDecoder().decode(encryptedData);

            // Extract IV and ciphertext
            ByteBuffer byteBuffer = ByteBuffer.wrap(decodedData);
            byte[] iv = new byte[GCM_IV_LENGTH];
            byteBuffer.get(iv);
            byte[] ciphertext = new byte[byteBuffer.remaining()];
            byteBuffer.get(ciphertext);

            // Create cipher
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            SecretKeySpec keySpec = new SecretKeySpec(getKeyBytes(), "AES");
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, keySpec, gcmSpec);

            // Decrypt
            byte[] plaintext = cipher.doFinal(ciphertext);
            String json = new String(plaintext, StandardCharsets.UTF_8);

            // Parse JSON
            return objectMapper.readValue(json, Map.class);

        } catch (Exception e) {
            log.error("Decryption failed", e);
            throw new RuntimeException("Decryption failed", e);
        }
    }

    /**
     * Get key bytes from encryption key string
     */
    private byte[] getKeyBytes() {
        byte[] key = encryptionKey.getBytes(StandardCharsets.UTF_8);
        if (key.length != 32) {
            throw new IllegalStateException("Encryption key must be exactly 32 characters");
        }
        return key;
    }
}
