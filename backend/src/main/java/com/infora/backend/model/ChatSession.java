package com.infora.backend.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class ChatSession {
    private String id;
    private String userId;
    private String language; // "en", "si", "ta"
    private List<Message> messages = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;

    public ChatSession() {}

    public ChatSession(String id, String userId, String language, List<Message> messages, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.userId = userId;
        this.language = language;
        this.messages = messages != null ? messages : new ArrayList<>();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public List<Message> getMessages() { return messages; }
    public void setMessages(List<Message> messages) { this.messages = messages; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
