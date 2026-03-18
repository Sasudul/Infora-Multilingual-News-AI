package com.infora.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.cloud.StorageClient;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

/**
 * Initializes the Firebase Admin SDK and exposes Firestore, FirebaseAuth,
 * and StorageClient as Spring-managed beans.
 *
 * Handles DevTools restarts properly by cleaning up stale Firebase instances.
 */
@Configuration
public class FirebaseConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.service-account-key:src/main/resources/firebase-service-account.json}")
    private String serviceAccountKeyPath;

    @PostConstruct
    public void initFirebase() throws IOException {
        // Clean up any existing FirebaseApp (handles DevTools restart)
        if (!FirebaseApp.getApps().isEmpty()) {
            log.info("Cleaning up existing Firebase instance (DevTools restart detected)");
            try {
                FirebaseApp.getInstance().delete();
            } catch (Exception e) {
                log.debug("Firebase cleanup: {}", e.getMessage());
            }
        }

        FileInputStream serviceAccount = new FileInputStream(serviceAccountKeyPath);

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        FirebaseApp.initializeApp(options);
        log.info("✅ Firebase Admin SDK initialized successfully");
    }

    @Bean
    public Firestore firestore() {
        return FirestoreClient.getFirestore();
    }

    @Bean
    public FirebaseAuth firebaseAuth() {
        return FirebaseAuth.getInstance();
    }

    @Bean
    public StorageClient storageClient() {
        return StorageClient.getInstance();
    }
}
