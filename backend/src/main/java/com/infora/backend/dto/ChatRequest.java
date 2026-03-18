package com.infora.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class ChatRequest {
    @NotBlank(message = "Message content is required")
    private String message;

    private String sessionId;

    private String language = "en"; // "en", "si", "ta"

    public ChatRequest() {}

    public ChatRequest(String message, String sessionId, String language) {
        this.message = message;
        this.sessionId = sessionId;
        this.language = language;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
