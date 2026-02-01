package io.celox.taskflow.task.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests for DatabaseController.
 * Verifies SQL query validation, security checks, and proper error handling.
 *
 * @author Martin Pfeffer
 */
@SpringBootTest
@AutoConfigureMockMvc
class DatabaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @Test
    @WithMockUser(username = "testuser")
    void shouldExecuteValidSelectQuery() throws Exception {
        // Given
        String query = "SELECT * FROM tasks";
        List<Map<String, Object>> mockResult = Arrays.asList(
                createRow("id", "1", "title", "Task 1"),
                createRow("id", "2", "title", "Task 2")
        );
        when(jdbcTemplate.queryForList(anyString())).thenReturn(mockResult);

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rowCount").value(2))
                .andExpect(jsonPath("$.rows").isArray())
                .andExpect(jsonPath("$.error").isEmpty());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldRejectDropStatement() throws Exception {
        // Given
        String query = "DROP TABLE users";

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldRejectDeleteStatement() throws Exception {
        // Given
        String query = "DELETE FROM users WHERE id = 1";

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldRejectInsertStatement() throws Exception {
        // Given
        String query = "INSERT INTO users (name) VALUES ('hacker')";

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldRejectUpdateStatement() throws Exception {
        // Given
        String query = "UPDATE users SET admin = true WHERE id = 1";

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldRejectSqlInjectionWithComments() throws Exception {
        // Given
        String query = "SELECT * FROM users -- WHERE admin = false";

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldRejectSqlInjectionWithBlockComments() throws Exception {
        // Given
        String query = "SELECT * FROM users /* bypass */ WHERE 1=1";

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldRejectStackedQueries() throws Exception {
        // Given
        String query = "SELECT * FROM users; DROP TABLE users";

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldAllowSelectWithWhere() throws Exception {
        // Given
        String query = "SELECT id, title FROM tasks WHERE status = 'OPEN'";
        List<Map<String, Object>> mockResult = Arrays.asList(
                createRow("id", "1", "title", "Task 1")
        );
        when(jdbcTemplate.queryForList(anyString())).thenReturn(mockResult);

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rowCount").value(1));
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldAllowSelectWithJoin() throws Exception {
        // Given
        String query = "SELECT t.title, u.username FROM tasks t JOIN users u ON t.assignee_id = u.id";
        List<Map<String, Object>> mockResult = Arrays.asList(
                createRow("title", "Task 1", "username", "user1")
        );
        when(jdbcTemplate.queryForList(anyString())).thenReturn(mockResult);

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rowCount").value(1));
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldAllowCTEQuery() throws Exception {
        // Given
        String query = "WITH task_counts AS (SELECT COUNT(*) as cnt FROM tasks) SELECT * FROM task_counts";
        List<Map<String, Object>> mockResult = Arrays.asList(
                createRow("cnt", "10")
        );
        when(jdbcTemplate.queryForList(anyString())).thenReturn(mockResult);

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rowCount").value(1));
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldRejectEmptyQuery() throws Exception {
        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldRejectTruncateStatement() throws Exception {
        // Given
        String query = "TRUNCATE TABLE users";

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldRejectAlterStatement() throws Exception {
        // Given
        String query = "ALTER TABLE users ADD COLUMN admin BOOLEAN";

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldRejectGrantStatement() throws Exception {
        // Given
        String query = "GRANT ALL ON users TO hacker";

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldAllowSelectWithCreatedAtColumn() throws Exception {
        // Given - Should NOT trigger false positive on "create" keyword in "created_at"
        String query = "SELECT id, created_at FROM tasks WHERE created_at > '2024-01-01'";
        List<Map<String, Object>> mockResult = Arrays.asList(
                createRow("id", "1", "created_at", "2024-06-01")
        );
        when(jdbcTemplate.queryForList(anyString())).thenReturn(mockResult);

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rowCount").value(1));
    }

    @Test
    void shouldRequireAuthentication() throws Exception {
        // When & Then - No authentication
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"SELECT 1\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "testuser")
    void shouldReturnExecutionTime() throws Exception {
        // Given
        String query = "SELECT * FROM tasks";
        List<Map<String, Object>> mockResult = Arrays.asList(
                createRow("id", "1", "title", "Task 1")
        );
        when(jdbcTemplate.queryForList(anyString())).thenReturn(mockResult);

        // When & Then
        mockMvc.perform(post("/api/v1/database/query")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"query\": \"" + query + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.executionTimeMs").exists());
    }

    private Map<String, Object> createRow(String... keyValues) {
        Map<String, Object> row = new HashMap<>();
        for (int i = 0; i < keyValues.length; i += 2) {
            row.put(keyValues[i], keyValues[i + 1]);
        }
        return row;
    }
}
