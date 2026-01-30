package io.celox.taskflow.task.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.celox.taskflow.task.dto.AuthResponseDto;
import io.celox.taskflow.task.dto.LoginDto;
import io.celox.taskflow.task.dto.RegisterDto;
import io.celox.taskflow.task.dto.UserDto;
import io.celox.taskflow.task.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldRegisterUserSuccessfully() throws Exception {
        // Given
        RegisterDto registerDto = RegisterDto.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .build();

        UserDto userDto = UserDto.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .email("test@example.com")
                .build();

        AuthResponseDto responseDto = new AuthResponseDto("jwt-token", userDto);

        when(authService.register(any(RegisterDto.class))).thenReturn(responseDto);

        // When & Then
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.user.username").value("testuser"))
                .andExpect(jsonPath("$.user.email").value("test@example.com"));
    }

    @Test
    void shouldLoginUserSuccessfully() throws Exception {
        // Given
        LoginDto loginDto = LoginDto.builder()
                .username("testuser")
                .password("password123")
                .build();

        UserDto userDto = UserDto.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .email("test@example.com")
                .build();

        AuthResponseDto responseDto = new AuthResponseDto("jwt-token", userDto);

        when(authService.login(any(LoginDto.class))).thenReturn(responseDto);

        // When & Then
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.user.username").value("testuser"));
    }

    @Test
    void shouldReturnBadRequestForInvalidRegisterData() throws Exception {
        // Given
        RegisterDto invalidDto = RegisterDto.builder()
                .username("") // Invalid: empty username
                .email("invalid-email") // Invalid email format
                .password("") // Invalid: empty password
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnBadRequestForInvalidLoginData() throws Exception {
        // Given
        LoginDto invalidDto = LoginDto.builder()
                .username("") // Invalid: empty username
                .password("") // Invalid: empty password
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }
}
