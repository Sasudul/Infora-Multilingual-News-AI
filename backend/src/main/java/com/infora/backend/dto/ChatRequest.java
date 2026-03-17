package com.infora.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    @NotBlank(message = "Message content is required")
    private String message;

    private String sessionId;

    @Builder.Default
    private String language = "en"; // "en", "si", "ta"
}
