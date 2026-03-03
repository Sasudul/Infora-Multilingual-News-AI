package com.infora.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.cloud.StorageClient;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

/**
 * Initializes the Firebase Admin SDK and exposes Firestore, FirebaseAuth,
 * and StorageClient as Spring-managed beans.
 *
 * Requires a service account JSON key file — path set via:
 *   FIREBASE_SERVICE_ACCOUNT_KEY (env variable) or
 *   firebase.service-account-key (application.properties)
 */
@Slf4j
@Configuration
public class FirebaseConfig {

    @Value("${firebase.service-account-key:src/main/resources/firebase-service-account.json}")
    private String serviceAccountKeyPath;

    @PostConstruct
    public void initFirebase() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            FileInputStream serviceAccount = new FileInputStream(serviceAccountKeyPath);

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);
            log.info("✅ Firebase Admin SDK initialized successfully");
        }
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
