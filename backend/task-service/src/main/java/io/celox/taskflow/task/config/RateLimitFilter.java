package io.celox.taskflow.task.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Rate Limiting Filter to protect against abuse.
 * 
 * Limits:
 * - /api/v1/auth/login: 5 requests per minute per IP (Brute-Force protection)
 * - /api/v1/code/execute: 10 requests per minute per user (Resource protection)
 * - /api/v1/database/query: 20 requests per minute per user (DB protection)
 * - /api/v1/email/send: 5 requests per minute per user (Spam protection)
 * 
 * @author Martin Pfeffer
 */
@Slf4j
@Component
@Order(1)
@ConditionalOnProperty(name = "app.rate-limiting.enabled", havingValue = "true", matchIfMissing = true)
public class RateLimitFilter extends OncePerRequestFilter {

    // Rate limit configurations: endpoint -> max requests per minute
    private static final Map<String, Integer> RATE_LIMITS = Map.of(
            "/api/v1/auth/login", 5,
            "/api/v1/auth/register", 3,
            "/api/v1/code/execute", 10,
            "/api/v1/database/query", 20,
            "/api/v1/email/send", 5
    );

    // Request counters: key (IP or userId + endpoint) -> counter
    private final Map<String, RateLimitEntry> requestCounters = new ConcurrentHashMap<>();

    // Cleanup scheduler
    private final ScheduledExecutorService cleanupScheduler;

    public RateLimitFilter() {
        // Schedule cleanup every minute to remove expired entries
        this.cleanupScheduler = Executors.newSingleThreadScheduledExecutor();
        this.cleanupScheduler.scheduleAtFixedRate(this::cleanupExpiredEntries, 1, 1, TimeUnit.MINUTES);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Only apply rate limiting to specific POST endpoints
        if (!"POST".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Find matching rate limit configuration
        Integer rateLimit = findRateLimit(path);
        if (rateLimit == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // Get identifier (IP for login/register, user ID for authenticated endpoints)
        String identifier = getIdentifier(request, path);
        String key = identifier + ":" + path;

        // Check and update rate limit
        if (isRateLimited(key, rateLimit)) {
            logRateLimitExceeded(identifier, path, rateLimit);
            sendRateLimitResponse(response, rateLimit);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private Integer findRateLimit(String path) {
        for (Map.Entry<String, Integer> entry : RATE_LIMITS.entrySet()) {
            if (path.startsWith(entry.getKey())) {
                return entry.getValue();
            }
        }
        return null;
    }

    private String getIdentifier(HttpServletRequest request, String path) {
        // For login/register, use IP address
        if (path.contains("/auth/login") || path.contains("/auth/register")) {
            return getClientIp(request);
        }

        // For authenticated endpoints, try to get user ID
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return "user:" + auth.getName();
        }

        // Fallback to IP
        return getClientIp(request);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }

    private boolean isRateLimited(String key, int limit) {
        long currentMinute = System.currentTimeMillis() / 60000;

        RateLimitEntry entry = requestCounters.compute(key, (k, existing) -> {
            if (existing == null || existing.minute != currentMinute) {
                return new RateLimitEntry(currentMinute, new AtomicInteger(1));
            }
            existing.count.incrementAndGet();
            return existing;
        });

        return entry.count.get() > limit;
    }

    private void logRateLimitExceeded(String identifier, String path, int limit) {
        log.warn("""
                
                ╔══════════════════════════════════════════════════════════════╗
                ║              ⚠️ RATE LIMIT EXCEEDED                          ║
                ╠══════════════════════════════════════════════════════════════╣
                ║ Identifier:  {}
                ║ Endpoint:    {}
                ║ Limit:       {} requests/minute
                ║ Timestamp:   {}
                ╚══════════════════════════════════════════════════════════════╝
                """,
                String.format("%-45s ║", identifier),
                String.format("%-45s ║", path),
                String.format("%-45s ║", limit),
                String.format("%-45s ║", LocalDateTime.now())
        );
    }

    private void sendRateLimitResponse(HttpServletResponse response, int limit) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.setHeader("X-RateLimit-Limit", String.valueOf(limit));
        response.setHeader("Retry-After", "60");
        response.getWriter().write(String.format(
                "{\"status\":429,\"message\":\"Rate limit exceeded. Maximum %d requests per minute allowed. Please try again later.\",\"timestamp\":\"%s\"}",
                limit,
                LocalDateTime.now()
        ));
    }

    private void cleanupExpiredEntries() {
        long currentMinute = System.currentTimeMillis() / 60000;
        requestCounters.entrySet().removeIf(entry -> entry.getValue().minute < currentMinute - 1);
    }

    /**
     * Rate limit entry storing the minute and request count.
     */
    private static class RateLimitEntry {
        final long minute;
        final AtomicInteger count;

        RateLimitEntry(long minute, AtomicInteger count) {
            this.minute = minute;
            this.count = count;
        }
    }
}
