package io.celox.taskflow.task.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.regex.Pattern;
import java.util.Date;

@RestController
@RequestMapping("/api/v1/database")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Database", description = "Database Query API")
public class DatabaseController {

    private final JdbcTemplate jdbcTemplate;

    // Dangerous SQL keywords that should trigger an alarm
    private static final Set<String> DANGEROUS_KEYWORDS = Set.of(
        "drop", "delete", "truncate", "alter", "create", "insert", "update",
        "grant", "revoke", "exec", "execute", "xp_", "sp_", "--", "/*", "*/",
        "script", "javascript", "vbscript", "onload", "onerror"
    );

    // Only allow SELECT and WITH (for CTEs) statements
    private static final Pattern ALLOWED_QUERY_PATTERN = Pattern.compile(
        "^\\s*(select|with)\\s+.*",
        Pattern.CASE_INSENSITIVE | Pattern.DOTALL
    );

    @PostMapping("/query")
    @Operation(summary = "Execute a SQL query")
    @ApiResponse(responseCode = "200", description = "Query executed successfully")
    public ResponseEntity<QueryResult> executeQuery(@RequestBody QueryRequest request) {
        long startTime = System.currentTimeMillis();
        String userId = getCurrentUserId();
        
        try {
            String query = request.getQuery();
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new QueryResult(null, 0, 0, "No query specified"));
            }

            // Security validation
            SecurityValidationResult validation = validateQuery(query, userId);
            if (!validation.isValid()) {
                logSecurityAlert(userId, query, validation.getReason());
                return ResponseEntity.badRequest()
                    .body(new QueryResult(null, 0, 0, validation.getReason()));
            }

            // Only SELECT queries are allowed
            String trimmedQuery = query.trim();
            List<Map<String, Object>> results = jdbcTemplate.queryForList(trimmedQuery);
            long executionTime = System.currentTimeMillis() - startTime;

            log.info("Query executed successfully by user {}: {} rows in {}ms", userId, results.size(), executionTime);
            return ResponseEntity.ok(new QueryResult(results, results.size(), executionTime, null));

        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            log.error("Database query failed for user {}: {}", userId, e.getMessage(), e);
            logSecurityAlert(userId, request.getQuery(), "Query execution failed: " + e.getMessage());
            return ResponseEntity.badRequest()
                .body(new QueryResult(null, 0, executionTime, "Query execution failed: " + e.getMessage()));
        }
    }

    /**
     * Validate SQL query for security threats
     */
    private SecurityValidationResult validateQuery(String query, String userId) {
        if (query == null || query.trim().isEmpty()) {
            return new SecurityValidationResult(false, "Query cannot be empty");
        }

        String queryLower = query.toLowerCase();
        String queryTrimmed = query.trim();

        // Check if query starts with allowed keywords (SELECT or WITH)
        if (!ALLOWED_QUERY_PATTERN.matcher(queryTrimmed).matches()) {
            return new SecurityValidationResult(false, 
                "Only SELECT and WITH (CTE) queries are allowed. Write operations are not permitted.");
        }

        // Check for dangerous keywords
        for (String keyword : DANGEROUS_KEYWORDS) {
            if (queryLower.contains(keyword)) {
                return new SecurityValidationResult(false, 
                    "Query contains prohibited keyword: " + keyword.toUpperCase());
            }
        }

        // Check for SQL injection patterns
        if (containsSqlInjectionPattern(query)) {
            return new SecurityValidationResult(false, 
                "Query contains potentially dangerous SQL injection patterns");
        }

        // Check query length (prevent extremely long queries)
        if (query.length() > 10000) {
            return new SecurityValidationResult(false, 
                "Query exceeds maximum length of 10000 characters");
        }

        return new SecurityValidationResult(true, null);
    }

    /**
     * Check for common SQL injection patterns
     */
    private boolean containsSqlInjectionPattern(String query) {
        String queryLower = query.toLowerCase();
        
        // Check for comment-based injection
        if (queryLower.contains("--") || queryLower.contains("/*") || queryLower.contains("*/")) {
            return true;
        }
        
        // Check for union-based injection (multiple UNION statements or UNION with suspicious patterns)
        if (queryLower.contains("union")) {
            String[] unionParts = queryLower.split("union");
            // More than 2 parts means multiple UNION statements (potential injection)
            if (unionParts.length > 2) {
                return true;
            }
            // Check for UNION ALL with suspicious patterns
            if (queryLower.contains("union all") && 
                (queryLower.contains("null") || queryLower.contains("1=1") || 
                 queryLower.contains("'1'='1'"))) {
                return true;
            }
        }
        
        // Check for stacked queries (semicolon followed by another statement)
        String[] statements = query.split(";");
        if (statements.length > 1) {
            for (int i = 1; i < statements.length; i++) {
                String stmt = statements[i].trim().toLowerCase();
                if (!stmt.isEmpty() && !stmt.startsWith("--")) {
                    return true; // Multiple statements detected
                }
            }
        }
        
        return false;
    }

    /**
     * Log security alert for suspicious activity
     */
    private void logSecurityAlert(String userId, String query, String reason) {
        log.error("╔══════════════════════════════════════════════════════════════╗");
        log.error("║              🚨 SECURITY ALERT - SQL INJECTION ATTEMPT      ║");
        log.error("╠══════════════════════════════════════════════════════════════╣");
        log.error("║ User ID:     {}", String.format("%-45s", userId != null ? userId : "UNKNOWN") + "║");
        log.error("║ Reason:      {}", String.format("%-45s", reason) + "║");
        log.error("║ Query:       {}", String.format("%-45s", truncate(query, 45)) + "║");
        log.error("║ Timestamp:   {}", String.format("%-45s", new Date().toString()) + "║");
        log.error("╚══════════════════════════════════════════════════════════════╝");
        
        // Also log to a separate security log file if needed
        System.err.println("[SECURITY ALERT] User: " + userId + " | Reason: " + reason + " | Query: " + query);
    }

    /**
     * Get current user ID from security context
     */
    private String getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getName() != null) {
                return authentication.getName();
            }
        } catch (Exception e) {
            log.warn("Could not extract user ID from security context", e);
        }
        return "UNKNOWN";
    }

    /**
     * Truncate string for logging
     */
    private String truncate(String str, int maxLength) {
        if (str == null) return "";
        return str.length() > maxLength ? str.substring(0, maxLength - 3) + "..." : str;
    }

    @Data
    private static class SecurityValidationResult {
        private final boolean valid;
        private final String reason;
    }

    @Data
    public static class QueryRequest {
        private String query;
    }

    @Data
    @RequiredArgsConstructor
    public static class QueryResult {
        private final List<Map<String, Object>> rows;
        private final int rowCount;
        private final long executionTimeMs;
        private final String error;
    }
}
