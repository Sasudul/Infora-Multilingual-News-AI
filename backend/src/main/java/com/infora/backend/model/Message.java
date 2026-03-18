package com.infora.backend.model;

import java.time.Instant;
import java.util.Map;

public class Message {
    private String role;       // "user", "assistant", "system"
    private String content;
    private String type;       // "text", "card", "step", "link"
    private Instant timestamp;
    private Map<String, Object> metadata;

    public Message() {}

    public Message(String role, String content, String type, Instant timestamp, Map<String, Object> metadata) {
        this.role = role;
        this.content = content;
        this.type = type;
        this.timestamp = timestamp;
        this.metadata = metadata;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}
