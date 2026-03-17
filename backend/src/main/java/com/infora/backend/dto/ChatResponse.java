package com.infora.backend.dto;

import com.infora.backend.model.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String sessionId;
    private Message reply;
    private List<ResponseCard> cards;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResponseCard {
        private String title;
        private String description;
        private String type; // "news", "service", "info"
        private String source;
        private String sourceUrl;
        private boolean verified;
    }
}
