package io.celox.taskflow.task.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests for HealthController.
 * Verifies health check endpoints for monitoring and Kubernetes probes.
 *
 * @author Martin Pfeffer
 */
@SpringBootTest
@AutoConfigureMockMvc
class HealthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @MockBean
    private KafkaTemplate<String, Object> kafkaTemplate;

    @MockBean
    private ProducerFactory<String, Object> producerFactory;

    @MockBean
    private Optional<BuildProperties> buildProperties;

    @Test
    void shouldReturnHealthStatusUp() throws Exception {
        // Given
        when(jdbcTemplate.queryForObject(eq("SELECT 1"), eq(Integer.class))).thenReturn(1);
        when(jdbcTemplate.queryForObject(eq("SELECT version()"), eq(String.class)))
                .thenReturn("PostgreSQL 15.4");
        when(kafkaTemplate.getProducerFactory()).thenReturn(producerFactory);
        when(producerFactory.getListeners()).thenReturn(Collections.emptyList());
        when(producerFactory.getConfigurationProperties()).thenReturn(Collections.emptyMap());

        // When & Then
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").exists())
                .andExpect(jsonPath("$.components").exists())
                .andExpect(jsonPath("$.components.database").exists())
                .andExpect(jsonPath("$.components.kafka").exists())
                .andExpect(jsonPath("$.system").exists())
                .andExpect(jsonPath("$.system.uptime").exists())
                .andExpect(jsonPath("$.system.memory").exists())
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    void shouldReturnLivenessProbeUp() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/v1/health/live"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void shouldReturnReadinessProbeUp() throws Exception {
        // Given
        when(jdbcTemplate.queryForObject(eq("SELECT 1"), eq(Integer.class))).thenReturn(1);
        when(kafkaTemplate.getProducerFactory()).thenReturn(producerFactory);
        when(producerFactory.getListeners()).thenReturn(Collections.emptyList());

        // When & Then
        mockMvc.perform(get("/api/v1/health/ready"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.database").value("UP"))
                .andExpect(jsonPath("$.kafka").value("UP"));
    }

    @Test
    void shouldReturnReadinessProbeDownWhenDatabaseFails() throws Exception {
        // Given
        when(jdbcTemplate.queryForObject(eq("SELECT 1"), eq(Integer.class)))
                .thenThrow(new RuntimeException("Database connection failed"));
        when(kafkaTemplate.getProducerFactory()).thenReturn(producerFactory);
        when(producerFactory.getListeners()).thenReturn(Collections.emptyList());

        // When & Then
        mockMvc.perform(get("/api/v1/health/ready"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.status").value("DOWN"))
                .andExpect(jsonPath("$.database").value("DOWN"));
    }

    @Test
    void shouldIncludeVersionInHealthResponse() throws Exception {
        // Given
        when(jdbcTemplate.queryForObject(eq("SELECT 1"), eq(Integer.class))).thenReturn(1);
        when(jdbcTemplate.queryForObject(eq("SELECT version()"), eq(String.class)))
                .thenReturn("PostgreSQL 15.4");
        when(kafkaTemplate.getProducerFactory()).thenReturn(producerFactory);
        when(producerFactory.getListeners()).thenReturn(Collections.emptyList());
        when(producerFactory.getConfigurationProperties()).thenReturn(Collections.emptyMap());

        // When & Then
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.version").exists())
                .andExpect(jsonPath("$.name").value("TaskFlow Platform"));
    }

    @Test
    void shouldIncludeSystemMetrics() throws Exception {
        // Given
        when(jdbcTemplate.queryForObject(eq("SELECT 1"), eq(Integer.class))).thenReturn(1);
        when(jdbcTemplate.queryForObject(eq("SELECT version()"), eq(String.class)))
                .thenReturn("PostgreSQL 15.4");
        when(kafkaTemplate.getProducerFactory()).thenReturn(producerFactory);
        when(producerFactory.getListeners()).thenReturn(Collections.emptyList());
        when(producerFactory.getConfigurationProperties()).thenReturn(Collections.emptyMap());

        // When & Then
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.system.processors").exists())
                .andExpect(jsonPath("$.system.javaVersion").exists())
                .andExpect(jsonPath("$.system.memory.used").exists())
                .andExpect(jsonPath("$.system.memory.max").exists());
    }
}
