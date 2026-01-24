package io.celox.taskflow.task.service;

import io.celox.taskflow.task.config.JwtTokenProvider;
import io.celox.taskflow.task.dto.AuthResponseDto;
import io.celox.taskflow.task.dto.LoginDto;
import io.celox.taskflow.task.dto.RegisterDto;
import io.celox.taskflow.task.dto.UserDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponseDto register(RegisterDto dto) {
        log.info("Registering new user: {}", dto.getUsername());
        UserDto user = userService.createUser(dto);
        String token = jwtTokenProvider.generateToken(user.getUsername());
        return new AuthResponseDto(token, user);
    }

    public AuthResponseDto login(LoginDto dto) {
        log.info("User login: {}", dto.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(dto.getUsername());

        UserDto user = userService.getUserByUsername(dto.getUsername());

        return new AuthResponseDto(token, user);
    }
}
