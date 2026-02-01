package io.celox.taskflow.task.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for DTO input validation.
 * Verifies all validation constraints on request DTOs.
 *
 * @author Martin Pfeffer
 */
class InputValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    // ==================== LoginDto Tests ====================

    @Test
    void loginDto_shouldPassWithValidData() {
        LoginDto dto = LoginDto.builder()
                .username("validuser")
                .password("validpassword")
                .build();

        Set<ConstraintViolation<LoginDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    @Test
    void loginDto_shouldFailWithEmptyUsername() {
        LoginDto dto = LoginDto.builder()
                .username("")
                .password("validpassword")
                .build();

        Set<ConstraintViolation<LoginDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("username")));
    }

    @Test
    void loginDto_shouldFailWithEmptyPassword() {
        LoginDto dto = LoginDto.builder()
                .username("validuser")
                .password("")
                .build();

        Set<ConstraintViolation<LoginDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    void loginDto_shouldFailWithTooLongUsername() {
        LoginDto dto = LoginDto.builder()
                .username("a".repeat(51)) // Max is 50
                .password("validpassword")
                .build();

        Set<ConstraintViolation<LoginDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @Test
    void loginDto_shouldFailWithTooShortPassword() {
        LoginDto dto = LoginDto.builder()
                .username("validuser")
                .password("12345") // Min is 6
                .build();

        Set<ConstraintViolation<LoginDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    // ==================== RegisterDto Tests ====================

    @Test
    void registerDto_shouldPassWithValidData() {
        RegisterDto dto = RegisterDto.builder()
                .username("newuser")
                .email("user@example.com")
                .password("securepassword")
                .build();

        Set<ConstraintViolation<RegisterDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    @Test
    void registerDto_shouldFailWithInvalidEmail() {
        RegisterDto dto = RegisterDto.builder()
                .username("newuser")
                .email("invalid-email")
                .password("securepassword")
                .build();

        Set<ConstraintViolation<RegisterDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }

    @Test
    void registerDto_shouldFailWithEmptyUsername() {
        RegisterDto dto = RegisterDto.builder()
                .username("")
                .email("user@example.com")
                .password("securepassword")
                .build();

        Set<ConstraintViolation<RegisterDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @Test
    void registerDto_shouldFailWithTooShortUsername() {
        RegisterDto dto = RegisterDto.builder()
                .username("ab") // Min is 3
                .email("user@example.com")
                .password("securepassword")
                .build();

        Set<ConstraintViolation<RegisterDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @ParameterizedTest
    @ValueSource(strings = {"test@test.com", "user.name@domain.org", "user+tag@example.co.uk"})
    void registerDto_shouldAcceptValidEmails(String email) {
        RegisterDto dto = RegisterDto.builder()
                .username("validuser")
                .email(email)
                .password("securepassword")
                .build();

        Set<ConstraintViolation<RegisterDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    // ==================== EmailRequest Tests ====================

    @Test
    void emailRequest_shouldPassWithValidData() {
        EmailRequest dto = EmailRequest.builder()
                .to("recipient@example.com")
                .subject("Test Subject")
                .body("Test email body content")
                .build();

        Set<ConstraintViolation<EmailRequest>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    @Test
    void emailRequest_shouldFailWithInvalidRecipientEmail() {
        EmailRequest dto = EmailRequest.builder()
                .to("invalid-email")
                .subject("Test Subject")
                .body("Test body")
                .build();

        Set<ConstraintViolation<EmailRequest>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("to")));
    }

    @Test
    void emailRequest_shouldFailWithEmptySubject() {
        EmailRequest dto = EmailRequest.builder()
                .to("recipient@example.com")
                .subject("")
                .body("Test body")
                .build();

        Set<ConstraintViolation<EmailRequest>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @Test
    void emailRequest_shouldFailWithTooLongSubject() {
        EmailRequest dto = EmailRequest.builder()
                .to("recipient@example.com")
                .subject("a".repeat(201)) // Max is 200
                .body("Test body")
                .build();

        Set<ConstraintViolation<EmailRequest>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @Test
    void emailRequest_shouldFailWithEmptyBody() {
        EmailRequest dto = EmailRequest.builder()
                .to("recipient@example.com")
                .subject("Test Subject")
                .body("")
                .build();

        Set<ConstraintViolation<EmailRequest>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @Test
    void emailRequest_shouldFailWithTooLongBody() {
        EmailRequest dto = EmailRequest.builder()
                .to("recipient@example.com")
                .subject("Test Subject")
                .body("a".repeat(50001)) // Max is 50000
                .build();

        Set<ConstraintViolation<EmailRequest>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    // ==================== CodeExecutionRequest Tests ====================

    @Test
    void codeExecutionRequest_shouldPassWithValidData() {
        CodeExecutionRequest dto = CodeExecutionRequest.builder()
                .code("return 1 + 1;")
                .build();

        Set<ConstraintViolation<CodeExecutionRequest>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    @Test
    void codeExecutionRequest_shouldFailWithEmptyCode() {
        CodeExecutionRequest dto = CodeExecutionRequest.builder()
                .code("")
                .build();

        Set<ConstraintViolation<CodeExecutionRequest>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @Test
    void codeExecutionRequest_shouldFailWithNullCode() {
        CodeExecutionRequest dto = CodeExecutionRequest.builder()
                .code(null)
                .build();

        Set<ConstraintViolation<CodeExecutionRequest>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @Test
    void codeExecutionRequest_shouldFailWithTooLongCode() {
        CodeExecutionRequest dto = CodeExecutionRequest.builder()
                .code("a".repeat(50001)) // Max is 50000
                .build();

        Set<ConstraintViolation<CodeExecutionRequest>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    // ==================== CreateTaskDto Tests ====================

    @Test
    void createTaskDto_shouldPassWithValidData() {
        CreateTaskDto dto = CreateTaskDto.builder()
                .title("Valid Task Title")
                .description("Task description")
                .priority(io.celox.taskflow.task.domain.TaskPriority.HIGH)
                .category(io.celox.taskflow.task.domain.TaskCategory.BUG)
                .build();

        Set<ConstraintViolation<CreateTaskDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    @Test
    void createTaskDto_shouldFailWithEmptyTitle() {
        CreateTaskDto dto = CreateTaskDto.builder()
                .title("")
                .priority(io.celox.taskflow.task.domain.TaskPriority.HIGH)
                .category(io.celox.taskflow.task.domain.TaskCategory.BUG)
                .build();

        Set<ConstraintViolation<CreateTaskDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @Test
    void createTaskDto_shouldFailWithTooShortTitle() {
        CreateTaskDto dto = CreateTaskDto.builder()
                .title("ab") // Min is 3
                .priority(io.celox.taskflow.task.domain.TaskPriority.HIGH)
                .category(io.celox.taskflow.task.domain.TaskCategory.BUG)
                .build();

        Set<ConstraintViolation<CreateTaskDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @Test
    void createTaskDto_shouldFailWithTooLongTitle() {
        CreateTaskDto dto = CreateTaskDto.builder()
                .title("a".repeat(201)) // Max is 200
                .priority(io.celox.taskflow.task.domain.TaskPriority.HIGH)
                .category(io.celox.taskflow.task.domain.TaskCategory.BUG)
                .build();

        Set<ConstraintViolation<CreateTaskDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @Test
    void createTaskDto_shouldFailWithNullPriority() {
        CreateTaskDto dto = CreateTaskDto.builder()
                .title("Valid Title")
                .priority(null)
                .category(io.celox.taskflow.task.domain.TaskCategory.BUG)
                .build();

        Set<ConstraintViolation<CreateTaskDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @Test
    void createTaskDto_shouldFailWithNullCategory() {
        CreateTaskDto dto = CreateTaskDto.builder()
                .title("Valid Title")
                .priority(io.celox.taskflow.task.domain.TaskPriority.HIGH)
                .category(null)
                .build();

        Set<ConstraintViolation<CreateTaskDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @Test
    void createTaskDto_shouldFailWithTooLongDescription() {
        CreateTaskDto dto = CreateTaskDto.builder()
                .title("Valid Title")
                .description("a".repeat(2001)) // Max is 2000
                .priority(io.celox.taskflow.task.domain.TaskPriority.HIGH)
                .category(io.celox.taskflow.task.domain.TaskCategory.BUG)
                .build();

        Set<ConstraintViolation<CreateTaskDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    // ==================== CreateWorkflowDto Tests ====================

    @Test
    void createWorkflowDto_shouldPassWithValidData() {
        CreateWorkflowDto dto = CreateWorkflowDto.builder()
                .name("Valid Workflow Name")
                .description("Workflow description")
                .build();

        Set<ConstraintViolation<CreateWorkflowDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    @Test
    void createWorkflowDto_shouldFailWithEmptyName() {
        CreateWorkflowDto dto = CreateWorkflowDto.builder()
                .name("")
                .build();

        Set<ConstraintViolation<CreateWorkflowDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @Test
    void createWorkflowDto_shouldFailWithTooShortName() {
        CreateWorkflowDto dto = CreateWorkflowDto.builder()
                .name("ab") // Min is 3
                .build();

        Set<ConstraintViolation<CreateWorkflowDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    // ==================== CreateCredentialDto Tests ====================

    @Test
    void createCredentialDto_shouldPassWithValidData() {
        CreateCredentialDto dto = CreateCredentialDto.builder()
                .name("My API Key")
                .type("api_key")
                .build();

        Set<ConstraintViolation<CreateCredentialDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }

    @Test
    void createCredentialDto_shouldFailWithEmptyName() {
        CreateCredentialDto dto = CreateCredentialDto.builder()
                .name("")
                .type("api_key")
                .build();

        Set<ConstraintViolation<CreateCredentialDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @Test
    void createCredentialDto_shouldFailWithInvalidType() {
        CreateCredentialDto dto = CreateCredentialDto.builder()
                .name("My Credential")
                .type("invalid_type")
                .build();

        Set<ConstraintViolation<CreateCredentialDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
    }

    @ParameterizedTest
    @ValueSource(strings = {"api_key", "basic_auth", "oauth2", "bearer_token"})
    void createCredentialDto_shouldAcceptValidTypes(String type) {
        CreateCredentialDto dto = CreateCredentialDto.builder()
                .name("My Credential")
                .type(type)
                .build();

        Set<ConstraintViolation<CreateCredentialDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty());
    }
}
