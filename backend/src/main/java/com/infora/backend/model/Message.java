package com.infora.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private String role;       // "user", "assistant", "system"
    private String content;
    private String type;       // "text", "card", "step", "link"
    private Instant timestamp;
    private Map<String, Object> metadata;
}
