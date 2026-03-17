package com.infora.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Infora Backend — Spring Boot REST API entry point.
 *
 * Provides REST endpoints for:
 *  - News retrieval & caching
 *  - Government service guidance
 *  - Chat / conversational orchestration
 *  - User management
 *
 * Uses Firebase (Firestore) as the primary database via the Firebase Admin SDK.
 */
@EnableScheduling
@SpringBootApplication
public class InforaBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(InforaBackendApplication.class, args);
    }
}
