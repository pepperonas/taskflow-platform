package io.celox.taskflow.task.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.PrintWriter;
import java.io.StringWriter;

import static org.mockito.Mockito.*;

/**
 * Tests for RateLimitFilter.
 * Verifies rate limiting functionality for various endpoints.
 *
 * @author Martin Pfeffer
 */
@ExtendWith(MockitoExtension.class)
class RateLimitFilterTest {

    private RateLimitFilter rateLimitFilter;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        rateLimitFilter = new RateLimitFilter();
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void shouldAllowRequestsWithinRateLimit() throws Exception {
        // Given
        when(request.getRequestURI()).thenReturn("/api/v1/auth/login");
        when(request.getMethod()).thenReturn("POST");
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");

        // When - First request should pass
        rateLimitFilter.doFilter(request, response, filterChain);

        // Then
        verify(filterChain, times(1)).doFilter(request, response);
        verify(response, never()).setStatus(429);
    }

    @Test
    void shouldAllowGetRequests() throws Exception {
        // Given
        when(request.getRequestURI()).thenReturn("/api/v1/auth/login");
        when(request.getMethod()).thenReturn("GET");

        // When
        rateLimitFilter.doFilter(request, response, filterChain);

        // Then - GET requests should pass through without rate limiting
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void shouldAllowNonRateLimitedEndpoints() throws Exception {
        // Given
        when(request.getRequestURI()).thenReturn("/api/v1/tasks");
        when(request.getMethod()).thenReturn("POST");

        // When
        rateLimitFilter.doFilter(request, response, filterChain);

        // Then - Non-rate-limited endpoints should pass
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void shouldBlockRequestsExceedingRateLimit() throws Exception {
        // Given
        when(request.getRequestURI()).thenReturn("/api/v1/auth/login");
        when(request.getMethod()).thenReturn("POST");
        when(request.getRemoteAddr()).thenReturn("10.0.0.1");
        
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(printWriter);

        // When - Make 6 requests (limit is 5)
        for (int i = 0; i < 6; i++) {
            rateLimitFilter.doFilter(request, response, filterChain);
        }

        // Then - First 5 should pass, 6th should be blocked
        verify(filterChain, times(5)).doFilter(request, response);
        verify(response, times(1)).setStatus(429);
    }

    @Test
    void shouldUseIpAddressForLoginEndpoint() throws Exception {
        // Given
        when(request.getRequestURI()).thenReturn("/api/v1/auth/login");
        when(request.getMethod()).thenReturn("POST");
        when(request.getRemoteAddr()).thenReturn("172.16.0.1");

        // When
        rateLimitFilter.doFilter(request, response, filterChain);

        // Then
        verify(filterChain, times(1)).doFilter(request, response);
        verify(request).getRemoteAddr();
    }

    @Test
    void shouldUseXForwardedForHeader() throws Exception {
        // Given
        when(request.getRequestURI()).thenReturn("/api/v1/auth/login");
        when(request.getMethod()).thenReturn("POST");
        when(request.getHeader("X-Forwarded-For")).thenReturn("203.0.113.1, 10.0.0.1");
        // Note: getRemoteAddr() is not stubbed because X-Forwarded-For takes precedence

        // When
        rateLimitFilter.doFilter(request, response, filterChain);

        // Then
        verify(filterChain, times(1)).doFilter(request, response);
        verify(request).getHeader("X-Forwarded-For");
    }

    @Test
    void shouldUseUserIdForAuthenticatedEndpoints() throws Exception {
        // Given
        when(request.getRequestURI()).thenReturn("/api/v1/code/execute");
        when(request.getMethod()).thenReturn("POST");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("user123");
        when(authentication.getName()).thenReturn("user123");

        // When
        rateLimitFilter.doFilter(request, response, filterChain);

        // Then
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void shouldApplyDifferentLimitsForDifferentEndpoints() throws Exception {
        // Given - Register endpoint has limit of 3
        when(request.getRequestURI()).thenReturn("/api/v1/auth/register");
        when(request.getMethod()).thenReturn("POST");
        when(request.getRemoteAddr()).thenReturn("192.168.100.1");
        
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(printWriter);

        // When - Make 4 requests (limit is 3)
        for (int i = 0; i < 4; i++) {
            rateLimitFilter.doFilter(request, response, filterChain);
        }

        // Then - First 3 should pass, 4th should be blocked
        verify(filterChain, times(3)).doFilter(request, response);
        verify(response, times(1)).setStatus(429);
    }

    @Test
    void shouldSetRateLimitHeaders() throws Exception {
        // Given
        when(request.getRequestURI()).thenReturn("/api/v1/auth/login");
        when(request.getMethod()).thenReturn("POST");
        when(request.getRemoteAddr()).thenReturn("192.168.200.1");
        
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(printWriter);

        // When - Exceed rate limit
        for (int i = 0; i < 6; i++) {
            rateLimitFilter.doFilter(request, response, filterChain);
        }

        // Then - Should set rate limit headers
        verify(response).setHeader(eq("X-RateLimit-Limit"), anyString());
        verify(response).setHeader(eq("Retry-After"), eq("60"));
    }

    @Test
    void shouldAllowDatabaseQueryEndpoint() throws Exception {
        // Given - Database query has limit of 20
        when(request.getRequestURI()).thenReturn("/api/v1/database/query");
        when(request.getMethod()).thenReturn("POST");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("dbuser");
        when(authentication.getName()).thenReturn("dbuser");

        // When - Make 15 requests (within limit of 20)
        for (int i = 0; i < 15; i++) {
            rateLimitFilter.doFilter(request, response, filterChain);
        }

        // Then - All should pass
        verify(filterChain, times(15)).doFilter(request, response);
        verify(response, never()).setStatus(429);
    }

    @Test
    void shouldAllowEmailSendEndpoint() throws Exception {
        // Given - Email send has limit of 5
        when(request.getRequestURI()).thenReturn("/api/v1/email/send");
        when(request.getMethod()).thenReturn("POST");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("emailuser");
        when(authentication.getName()).thenReturn("emailuser");

        // When - Make 3 requests (within limit of 5)
        for (int i = 0; i < 3; i++) {
            rateLimitFilter.doFilter(request, response, filterChain);
        }

        // Then - All should pass
        verify(filterChain, times(3)).doFilter(request, response);
        verify(response, never()).setStatus(429);
    }
}
