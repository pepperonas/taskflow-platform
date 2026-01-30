package io.celox.taskflow.task.service;

import io.celox.taskflow.task.config.JwtTokenProvider;
import io.celox.taskflow.task.dto.AuthResponseDto;
import io.celox.taskflow.task.dto.LoginDto;
import io.celox.taskflow.task.dto.RegisterDto;
import io.celox.taskflow.task.dto.UserDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserService userService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    void shouldRegisterUserSuccessfully() {
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

        when(userService.createUser(registerDto)).thenReturn(userDto);
        when(jwtTokenProvider.generateToken("testuser")).thenReturn("jwt-token");

        // When
        AuthResponseDto response = authService.register(registerDto);

        // Then
        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("testuser", response.getUser().getUsername());
        verify(userService, times(1)).createUser(registerDto);
        verify(jwtTokenProvider, times(1)).generateToken("testuser");
    }

    @Test
    void shouldLoginUserSuccessfully() {
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

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtTokenProvider.generateToken("testuser")).thenReturn("jwt-token");
        when(userService.getUserByUsername("testuser")).thenReturn(userDto);

        // When
        AuthResponseDto response = authService.login(loginDto);

        // Then
        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("testuser", response.getUser().getUsername());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtTokenProvider, times(1)).generateToken("testuser");
    }

    @Test
    void shouldThrowExceptionOnInvalidLogin() {
        // Given
        LoginDto loginDto = LoginDto.builder()
                .username("testuser")
                .password("wrongpassword")
                .build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // When & Then
        assertThrows(BadCredentialsException.class, () -> authService.login(loginDto));
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtTokenProvider, never()).generateToken(anyString());
    }
}
