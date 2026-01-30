package io.celox.taskflow.task.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/database")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Database", description = "Database Query API")
public class DatabaseController {

    private final JdbcTemplate jdbcTemplate;

    @PostMapping("/query")
    @Operation(summary = "Execute a SQL query")
    @ApiResponse(responseCode = "200", description = "Query executed successfully")
    public ResponseEntity<QueryResult> executeQuery(@RequestBody QueryRequest request) {
        long startTime = System.currentTimeMillis();
        
        try {
            String query = request.getQuery();
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new QueryResult(null, 0, 0, "No query specified"));
            }

            // Determine operation type
            String trimmedQuery = query.trim().toLowerCase();
            boolean isSelect = trimmedQuery.startsWith("select") || 
                             trimmedQuery.startsWith("with");

            if (isSelect) {
                // Execute SELECT query
                List<Map<String, Object>> results = jdbcTemplate.queryForList(query);
                long executionTime = System.currentTimeMillis() - startTime;

                log.info("Query executed successfully: {} rows in {}ms", results.size(), executionTime);
                return ResponseEntity.ok(new QueryResult(results, results.size(), executionTime, null));
            } else {
                // Execute INSERT, UPDATE, DELETE
                int affectedRows = jdbcTemplate.update(query);
                long executionTime = System.currentTimeMillis() - startTime;

                log.info("Query executed successfully: {} rows affected in {}ms", affectedRows, executionTime);
                Map<String, Object> result = new HashMap<>();
                result.put("affectedRows", affectedRows);
                return ResponseEntity.ok(new QueryResult(List.of(result), affectedRows, executionTime, null));
            }

        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            log.error("Database query failed", e);
            return ResponseEntity.badRequest()
                .body(new QueryResult(null, 0, executionTime, e.getMessage()));
        }
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
