package com.infora.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security configuration.
 *
 * Currently configured in a permissive skeleton mode:
 *  - CSRF disabled (stateless REST API)
 *  - Sessions disabled (stateless)
 *  - All endpoints permitted (TODO: add Firebase token filter)
 *
 * In a future iteration, a custom Firebase Authentication filter
 * should be added to verify ID tokens on protected endpoints.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .cors(cors -> cors.configurationSource(
                new CorsConfig().corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(
                    "/api/health",
                    "/api/v1/news/**",
                    "/api/v1/services/**",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/actuator/**"
                ).permitAll()
                // All other endpoints require authentication (future)
                .anyRequest().permitAll() // TODO: change to .authenticated()
            );

        return http.build();
    }
}
