package com.infora.backend.dto;

import com.infora.backend.model.Message;

import java.util.List;

public class ChatResponse {
    private String sessionId;
    private Message reply;
    private List<ResponseCard> cards;

    public ChatResponse() {}

    public ChatResponse(String sessionId, Message reply, List<ResponseCard> cards) {
        this.sessionId = sessionId;
        this.reply = reply;
        this.cards = cards;
    }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public Message getReply() { return reply; }
    public void setReply(Message reply) { this.reply = reply; }
    public List<ResponseCard> getCards() { return cards; }
    public void setCards(List<ResponseCard> cards) { this.cards = cards; }

    public static class ResponseCard {
        private String title;
        private String description;
        private String type; // "news", "service", "info"
        private String source;
        private String sourceUrl;
        private boolean verified;

        public ResponseCard() {}

        public ResponseCard(String title, String description, String type, String source, String sourceUrl, boolean verified) {
            this.title = title;
            this.description = description;
            this.type = type;
            this.source = source;
            this.sourceUrl = sourceUrl;
            this.verified = verified;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        public String getSourceUrl() { return sourceUrl; }
        public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }
        public boolean isVerified() { return verified; }
        public void setVerified(boolean verified) { this.verified = verified; }
    }
}
