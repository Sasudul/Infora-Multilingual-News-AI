package com.infora.backend.repository;

import com.google.cloud.firestore.*;
import com.infora.backend.model.ChatSession;
import com.infora.backend.model.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class ChatRepository {

    private static final Logger log = LoggerFactory.getLogger(ChatRepository.class);

    private final Firestore firestore;
    private static final String COLLECTION = "chatSessions";

    public ChatRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public ChatSession create(String userId, String language) {
        try {
            String sessionId = UUID.randomUUID().toString();
            ChatSession session = new ChatSession(
                    sessionId, userId, language, new ArrayList<>(), Instant.now(), Instant.now());

            Map<String, Object> data = Map.of(
                    "userId", userId,
                    "language", language,
                    "messages", new ArrayList<>(),
                    "createdAt", session.getCreatedAt().toString(),
                    "updatedAt", session.getUpdatedAt().toString()
            );
            firestore.collection(COLLECTION).document(sessionId).set(data).get();
            log.info("Chat session created: {}", sessionId);
            return session;
        } catch (Exception e) {
            log.error("Failed to create chat session", e);
            throw new RuntimeException("Failed to create chat session", e);
        }
    }

    public Optional<ChatSession> findById(String sessionId) {
        try {
            DocumentSnapshot doc = firestore.collection(COLLECTION).document(sessionId).get().get();
            if (!doc.exists()) return Optional.empty();
            return Optional.of(documentToSession(doc));
        } catch (Exception e) {
            log.error("Failed to fetch chat session: {}", sessionId, e);
            throw new RuntimeException("Failed to fetch chat session", e);
        }
    }

    public List<ChatSession> findByUserId(String userId) {
        try {
            QuerySnapshot snapshot = firestore.collection(COLLECTION)
                    .whereEqualTo("userId", userId)
                    .orderBy("updatedAt", Query.Direction.DESCENDING)
                    .limit(50)
                    .get().get();
            return snapshot.getDocuments().stream()
                    .map(this::documentToSession)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to fetch sessions for user: {}", userId, e);
            throw new RuntimeException("Failed to fetch chat sessions", e);
        }
    }

    @SuppressWarnings("unchecked")
    public void addMessage(String sessionId, Message message) {
        try {
            Map<String, Object> msgMap = new HashMap<>();
            msgMap.put("role", message.getRole());
            msgMap.put("content", message.getContent());
            msgMap.put("type", message.getType() != null ? message.getType() : "text");
            msgMap.put("timestamp", Instant.now().toString());
            if (message.getMetadata() != null) {
                msgMap.put("metadata", message.getMetadata());
            }

            firestore.collection(COLLECTION).document(sessionId)
                    .update(
                            "messages", FieldValue.arrayUnion(msgMap),
                            "updatedAt", Instant.now().toString()
                    ).get();
            log.debug("Message added to session: {}", sessionId);
        } catch (Exception e) {
            log.error("Failed to add message to session: {}", sessionId, e);
            throw new RuntimeException("Failed to add message", e);
        }
    }

    public void delete(String sessionId) {
        try {
            firestore.collection(COLLECTION).document(sessionId).delete().get();
            log.info("Chat session deleted: {}", sessionId);
        } catch (Exception e) {
            log.error("Failed to delete chat session: {}", sessionId, e);
            throw new RuntimeException("Failed to delete chat session", e);
        }
    }

    @SuppressWarnings("unchecked")
    private ChatSession documentToSession(DocumentSnapshot doc) {
        List<Map<String, Object>> rawMessages =
                (List<Map<String, Object>>) doc.get("messages");

        List<Message> messages = new ArrayList<>();
        if (rawMessages != null) {
            messages = rawMessages.stream().map(m -> {
                Message msg = new Message();
                msg.setRole((String) m.get("role"));
                msg.setContent((String) m.get("content"));
                msg.setType((String) m.getOrDefault("type", "text"));
                msg.setTimestamp(m.get("timestamp") != null
                        ? Instant.parse((String) m.get("timestamp"))
                        : Instant.now());
                return msg;
            }).collect(Collectors.toList());
        }

        return new ChatSession(
                doc.getId(),
                doc.getString("userId"),
                doc.getString("language"),
                messages,
                doc.getString("createdAt") != null
                        ? Instant.parse(doc.getString("createdAt")) : Instant.now(),
                doc.getString("updatedAt") != null
                        ? Instant.parse(doc.getString("updatedAt")) : Instant.now()
        );
    }
}
