package com.infora.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatSession {
    private String id;
    private String userId;
    private String language; // "en", "si", "ta"
    @Builder.Default
    private List<Message> messages = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;
}
