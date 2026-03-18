package com.infora.backend.controller;

import com.infora.backend.dto.ApiResponse;
import com.infora.backend.dto.ChatRequest;
import com.infora.backend.dto.ChatResponse;
import com.infora.backend.model.ChatSession;
import com.infora.backend.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@Tag(name = "Chat", description = "Conversational AI chat endpoints")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    @Operation(summary = "Send a message and get AI response")
    public ResponseEntity<ApiResponse<ChatResponse>> sendMessage(
            @RequestHeader(value = "X-User-Id", defaultValue = "anonymous") String userId,
            @Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatService.processMessage(userId, request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/sessions")
    @Operation(summary = "Get all chat sessions for a user")
    public ResponseEntity<ApiResponse<List<ChatSession>>> getUserSessions(
            @RequestHeader(value = "X-User-Id", defaultValue = "anonymous") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(chatService.getUserSessions(userId)));
    }

    @GetMapping("/sessions/{sessionId}")
    @Operation(summary = "Get a specific chat session with messages")
    public ResponseEntity<ApiResponse<ChatSession>> getSession(@PathVariable String sessionId) {
        return ResponseEntity.ok(ApiResponse.ok(chatService.getSession(sessionId)));
    }

    @DeleteMapping("/sessions/{sessionId}")
    @Operation(summary = "Delete a chat session")
    public ResponseEntity<ApiResponse<String>> deleteSession(@PathVariable String sessionId) {
        chatService.deleteSession(sessionId);
        return ResponseEntity.ok(ApiResponse.ok("Session deleted"));
    }
}
