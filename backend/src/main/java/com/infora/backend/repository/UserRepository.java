package com.infora.backend.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.infora.backend.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@Repository
public class UserRepository {

    private static final Logger log = LoggerFactory.getLogger(UserRepository.class);

    private final Firestore firestore;
    private static final String COLLECTION = "users";

    public UserRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public User save(String userId, User user) {
        try {
            user.setId(userId);
            if (user.getCreatedAt() == null) {
                user.setCreatedAt(Instant.now());
            }
            Map<String, Object> data = new java.util.HashMap<>();
            data.put("name", user.getName());
            data.put("email", user.getEmail());
            data.put("profileImageUrl", user.getProfileImageUrl());
            data.put("preferredLanguage", user.getPreferredLanguage());
            data.put("createdAt", user.getCreatedAt().toString());
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

    private Instant parseInstant(Object val) {
        if (val == null) return Instant.now();
        if (val instanceof String) {
            try {
                return Instant.parse((String) val);
            } catch (Exception e) {
                return Instant.now();
            }
        }
        if (val instanceof com.google.cloud.Timestamp) {
            return Instant.ofEpochSecond(((com.google.cloud.Timestamp) val).getSeconds(), ((com.google.cloud.Timestamp) val).getNanos());
        }
        return Instant.now();
    }

    private User documentToUser(DocumentSnapshot doc) {
        return new User(
                doc.getId(),
                doc.getString("name"),
                doc.getString("email"),
                doc.getString("profileImageUrl"),
                doc.getString("preferredLanguage"),
                parseInstant(doc.get("createdAt"))
        );
    }
}
