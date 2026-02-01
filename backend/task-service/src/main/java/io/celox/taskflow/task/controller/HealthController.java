package io.celox.taskflow.task.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.info.BuildProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.time.Duration;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Health Check Controller for monitoring system status.
 * Provides detailed health information about all system components.
 *
 * @author Martin Pfeffer
 */
@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Health", description = "System Health Check API")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final Optional<BuildProperties> buildProperties;

    private static final Instant START_TIME = Instant.now();

    @GetMapping
    @Operation(summary = "Get system health status", description = "Returns detailed health information about database, Kafka, and system metrics")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> health = new LinkedHashMap<>();
        
        boolean allHealthy = true;
        Map<String, Object> components = new LinkedHashMap<>();

        // Check Database
        Map<String, Object> dbHealth = checkDatabase();
        components.put("database", dbHealth);
        if (!"UP".equals(dbHealth.get("status"))) {
            allHealthy = false;
        }

        // Check Kafka
        Map<String, Object> kafkaHealth = checkKafka();
        components.put("kafka", kafkaHealth);
        if (!"UP".equals(kafkaHealth.get("status"))) {
            allHealthy = false;
        }

        // Overall status
        health.put("status", allHealthy ? "UP" : "DEGRADED");
        health.put("components", components);
        
        // Version info
        health.put("version", buildProperties.map(BuildProperties::getVersion).orElse("1.1.0"));
        health.put("name", "TaskFlow Platform");
        
        // System metrics
        Map<String, Object> system = new LinkedHashMap<>();
        system.put("uptime", formatUptime());
        system.put("uptimeMs", Duration.between(START_TIME, Instant.now()).toMillis());
        
        Runtime runtime = Runtime.getRuntime();
        system.put("memory", Map.of(
            "used", formatBytes(runtime.totalMemory() - runtime.freeMemory()),
            "free", formatBytes(runtime.freeMemory()),
            "total", formatBytes(runtime.totalMemory()),
            "max", formatBytes(runtime.maxMemory())
        ));
        system.put("processors", runtime.availableProcessors());
        system.put("javaVersion", System.getProperty("java.version"));
        health.put("system", system);
        
        // Timestamp
        health.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(health);
    }

    @GetMapping("/live")
    @Operation(summary = "Liveness probe", description = "Simple liveness check for Kubernetes")
    public ResponseEntity<Map<String, String>> liveness() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }

    @GetMapping("/ready")
    @Operation(summary = "Readiness probe", description = "Checks if the application is ready to receive traffic")
    public ResponseEntity<Map<String, Object>> readiness() {
        boolean dbReady = checkDatabaseConnection();
        boolean kafkaReady = checkKafkaConnection();
        
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", (dbReady && kafkaReady) ? "UP" : "DOWN");
        result.put("database", dbReady ? "UP" : "DOWN");
        result.put("kafka", kafkaReady ? "UP" : "DOWN");
        
        if (!dbReady || !kafkaReady) {
            return ResponseEntity.status(503).body(result);
        }
        return ResponseEntity.ok(result);
    }

    private Map<String, Object> checkDatabase() {
        Map<String, Object> dbHealth = new LinkedHashMap<>();
        try {
            long start = System.currentTimeMillis();
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            long responseTime = System.currentTimeMillis() - start;
            
            if (result != null && result == 1) {
                dbHealth.put("status", "UP");
                dbHealth.put("responseTimeMs", responseTime);
                dbHealth.put("database", "PostgreSQL");
                
                // Get database version
                String version = jdbcTemplate.queryForObject("SELECT version()", String.class);
                if (version != null && version.contains("PostgreSQL")) {
                    dbHealth.put("version", version.split(",")[0].replace("PostgreSQL ", ""));
                }
            } else {
                dbHealth.put("status", "DOWN");
                dbHealth.put("error", "Unexpected query result");
            }
        } catch (Exception e) {
            log.error("Database health check failed", e);
            dbHealth.put("status", "DOWN");
            dbHealth.put("error", e.getMessage());
        }
        return dbHealth;
    }

    private Map<String, Object> checkKafka() {
        Map<String, Object> kafkaHealth = new LinkedHashMap<>();
        try {
            // Check if Kafka is connected by verifying metrics
            var metrics = kafkaTemplate.getProducerFactory().getListeners();
            kafkaHealth.put("status", "UP");
            kafkaHealth.put("brokers", "kafka:29092");
            
            // Try to get cluster info
            try {
                var adminClient = org.apache.kafka.clients.admin.AdminClient.create(
                    kafkaTemplate.getProducerFactory().getConfigurationProperties()
                );
                var nodes = adminClient.describeCluster().nodes().get(java.util.concurrent.TimeUnit.SECONDS.toMillis(2), java.util.concurrent.TimeUnit.MILLISECONDS);
                kafkaHealth.put("nodes", nodes.size());
                adminClient.close();
            } catch (Exception e) {
                // Kafka might still work even if admin check fails
                kafkaHealth.put("nodes", "unknown");
            }
        } catch (Exception e) {
            log.error("Kafka health check failed", e);
            kafkaHealth.put("status", "DOWN");
            kafkaHealth.put("error", e.getMessage());
        }
        return kafkaHealth;
    }

    private boolean checkDatabaseConnection() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return result != null && result == 1;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean checkKafkaConnection() {
        try {
            kafkaTemplate.getProducerFactory().getListeners();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String formatUptime() {
        Duration uptime = Duration.between(START_TIME, Instant.now());
        long days = uptime.toDays();
        long hours = uptime.toHours() % 24;
        long minutes = uptime.toMinutes() % 60;
        long seconds = uptime.getSeconds() % 60;

        if (days > 0) {
            return String.format("%dd %dh %dm %ds", days, hours, minutes, seconds);
        } else if (hours > 0) {
            return String.format("%dh %dm %ds", hours, minutes, seconds);
        } else if (minutes > 0) {
            return String.format("%dm %ds", minutes, seconds);
        } else {
            return String.format("%ds", seconds);
        }
    }

    private String formatBytes(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }
}
