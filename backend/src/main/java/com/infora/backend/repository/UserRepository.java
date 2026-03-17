package com.infora.backend.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.infora.backend.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Repository
@RequiredArgsConstructor
public class UserRepository {

    private final Firestore firestore;
    private static final String COLLECTION = "users";

    public User save(String userId, User user) {
        try {
            user.setId(userId);
            if (user.getCreatedAt() == null) {
                user.setCreatedAt(Instant.now());
            }
            Map<String, Object> data = Map.of(
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "preferredLanguage", user.getPreferredLanguage(),
                    "createdAt", user.getCreatedAt().toString()
            );
            firestore.collection(COLLECTION).document(userId).set(data).get();
            log.info("User saved: {}", userId);
            return user;
        } catch (Exception e) {
            log.error("Failed to save user: {}", userId, e);
            throw new RuntimeException("Failed to save user", e);
        }
    }

    public Optional<User> findById(String userId) {
        try {
            DocumentSnapshot doc = firestore.collection(COLLECTION).document(userId).get().get();
            if (!doc.exists()) return Optional.empty();
            return Optional.of(documentToUser(doc));
        } catch (Exception e) {
            log.error("Failed to fetch user: {}", userId, e);
            throw new RuntimeException("Failed to fetch user", e);
        }
    }

    public void updateLanguage(String userId, String language) {
        try {
            firestore.collection(COLLECTION).document(userId)
                    .update("preferredLanguage", language).get();
            log.info("Updated language for user {}: {}", userId, language);
        } catch (Exception e) {
            log.error("Failed to update language for user: {}", userId, e);
            throw new RuntimeException("Failed to update user language", e);
        }
    }

    public void delete(String userId) {
        try {
            firestore.collection(COLLECTION).document(userId).delete().get();
            log.info("User deleted: {}", userId);
        } catch (Exception e) {
            log.error("Failed to delete user: {}", userId, e);
            throw new RuntimeException("Failed to delete user", e);
        }
    }

    private User documentToUser(DocumentSnapshot doc) {
        return User.builder()
                .id(doc.getId())
                .name(doc.getString("name"))
                .email(doc.getString("email"))
                .preferredLanguage(doc.getString("preferredLanguage"))
                .createdAt(doc.getString("createdAt") != null
                        ? Instant.parse(doc.getString("createdAt"))
                        : Instant.now())
                .build();
    }
}
