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

            Map<String, Object> data = new HashMap<>();
            data.put("userId", userId != null ? userId : "anonymous");
            data.put("language", language != null ? language : "en");
            data.put("messages", new ArrayList<>());
            data.put("createdAt", session.getCreatedAt() != null ? session.getCreatedAt().toString() : Instant.now().toString());
            data.put("updatedAt", session.getUpdatedAt() != null ? session.getUpdatedAt().toString() : Instant.now().toString());
            
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
            
            try {
                return Optional.of(documentToSession(doc));
            } catch (Exception e) {
                log.error("Failed to parse chat session document {}: {}", sessionId, e.getMessage());
                return Optional.empty(); // Effectively treat it as not found instead of crashing
            }
        } catch (Exception e) {
            log.error("Failed to fetch chat session: {}", sessionId, e);
            throw new RuntimeException("Failed to fetch chat session", e);
        }
    }

    public List<ChatSession> findByUserId(String userId) {
        try {
            QuerySnapshot snapshot = firestore.collection(COLLECTION)
                    .whereEqualTo("userId", userId)
                    .limit(50)
                    .get().get();
            return snapshot.getDocuments().stream()
                    .map(doc -> {
                        try {
                            return documentToSession(doc);
                        } catch (Exception e) {
                            log.error("Failed to parse session {}: {}", doc.getId(), e.getMessage());
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
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
            msgMap.put("role", message.getRole() != null ? message.getRole() : "user");
            msgMap.put("content", message.getContent() != null ? message.getContent() : "");
            msgMap.put("type", message.getType() != null ? message.getType() : "text");
            msgMap.put("timestamp", Instant.now().toString());
            if (message.getMetadata() != null) {
                msgMap.put("metadata", message.getMetadata());
            }
            // Persist cards for chat history
            if (message.getCards() != null && !message.getCards().isEmpty()) {
                List<Map<String, Object>> cardMaps = new ArrayList<>();
                for (com.infora.backend.dto.ChatResponse.ResponseCard card : message.getCards()) {
                    Map<String, Object> cm = new HashMap<>();
                    if (card.getTitle() != null) cm.put("title", card.getTitle());
                    if (card.getTitleSi() != null) cm.put("titleSi", card.getTitleSi());
                    if (card.getTitleTa() != null) cm.put("titleTa", card.getTitleTa());
                    if (card.getDescription() != null) cm.put("description", card.getDescription());
                    if (card.getDescriptionSi() != null) cm.put("descriptionSi", card.getDescriptionSi());
                    if (card.getDescriptionTa() != null) cm.put("descriptionTa", card.getDescriptionTa());
                    if (card.getType() != null) cm.put("type", card.getType());
                    if (card.getSource() != null) cm.put("source", card.getSource());
                    if (card.getSourceUrl() != null) cm.put("sourceUrl", card.getSourceUrl());
                    cm.put("verified", card.isVerified());
                    if (card.getImageUrl() != null) cm.put("imageUrl", card.getImageUrl());
                    if (card.getPublishedAt() != null) cm.put("publishedAt", card.getPublishedAt());
                    if (card.getDistrict() != null) cm.put("district", card.getDistrict());
                    cardMaps.add(cm);
                }
                msgMap.put("cards", cardMaps);
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

    @SuppressWarnings("unchecked")
    private ChatSession documentToSession(DocumentSnapshot doc) {
        List<Map<String, Object>> rawMessages =
                (List<Map<String, Object>>) doc.get("messages");

        List<Message> messages = new ArrayList<>();
        if (rawMessages != null) {
            messages = rawMessages.stream().map(m -> {
                Message msg = new Message();
                msg.setRole(m.get("role") != null ? m.get("role").toString() : "user");
                msg.setContent(m.get("content") != null ? m.get("content").toString() : "");
                msg.setType(m.get("type") != null ? m.get("type").toString() : "text");
                msg.setTimestamp(parseInstant(m.get("timestamp")));
                
                // Restore cards from persisted data
                Object cardsObj = m.get("cards");
                if (cardsObj instanceof List) {
                    List<Map<String, Object>> rawCards = (List<Map<String, Object>>) cardsObj;
                    List<com.infora.backend.dto.ChatResponse.ResponseCard> cards = new ArrayList<>();
                    for (Map<String, Object> rc : rawCards) {
                        try {
                            com.infora.backend.dto.ChatResponse.ResponseCard card = new com.infora.backend.dto.ChatResponse.ResponseCard();
                            if (rc.get("title") != null) card.setTitle(rc.get("title").toString());
                            if (rc.get("titleSi") != null) card.setTitleSi(rc.get("titleSi").toString());
                            if (rc.get("titleTa") != null) card.setTitleTa(rc.get("titleTa").toString());
                            if (rc.get("description") != null) card.setDescription(rc.get("description").toString());
                            if (rc.get("descriptionSi") != null) card.setDescriptionSi(rc.get("descriptionSi").toString());
                            if (rc.get("descriptionTa") != null) card.setDescriptionTa(rc.get("descriptionTa").toString());
                            if (rc.get("type") != null) card.setType(rc.get("type").toString());
                            if (rc.get("source") != null) card.setSource(rc.get("source").toString());
                            if (rc.get("sourceUrl") != null) card.setSourceUrl(rc.get("sourceUrl").toString());
                            card.setVerified(Boolean.TRUE.equals(rc.get("verified")));
                            if (rc.get("imageUrl") != null) card.setImageUrl(rc.get("imageUrl").toString());
                            if (rc.get("publishedAt") != null) card.setPublishedAt(rc.get("publishedAt").toString());
                            if (rc.get("district") != null) card.setDistrict(rc.get("district").toString());
                            cards.add(card);
                        } catch (Exception e) {
                            log.warn("Skipping malformed card in message", e);
                        }
                    }
                    msg.setCards(cards);
                }
                return msg;
            }).collect(Collectors.toList());
        }

        return new ChatSession(
                doc.getId(),
                doc.getString("userId"),
                doc.getString("language"),
                messages,
                parseInstant(doc.get("createdAt")),
                parseInstant(doc.get("updatedAt"))
        );
    }
}
