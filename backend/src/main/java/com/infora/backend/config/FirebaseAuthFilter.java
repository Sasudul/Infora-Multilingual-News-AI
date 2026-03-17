package com.infora.backend.config;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Firebase Authentication filter that verifies ID tokens
 * from the Authorization header.
 *
 * Currently in permissive mode — logs warnings but allows requests through.
 * To enforce auth: return 401 when token is missing/invalid.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FirebaseAuthFilter extends OncePerRequestFilter {

    private final FirebaseAuth firebaseAuth;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String idToken = authHeader.substring(7);
            try {
                FirebaseToken decodedToken = firebaseAuth.verifyIdToken(idToken);
                request.setAttribute("firebaseUid", decodedToken.getUid());
                request.setAttribute("firebaseEmail", decodedToken.getEmail());
                log.debug("Authenticated user: {}", decodedToken.getUid());
            } catch (Exception e) {
                log.warn("Invalid Firebase token: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Skip auth check for public endpoints
        return path.startsWith("/api/health") ||
               path.startsWith("/swagger-ui") ||
               path.startsWith("/v3/api-docs") ||
               path.startsWith("/actuator");
    }
}
