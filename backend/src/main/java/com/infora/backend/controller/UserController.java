package com.infora.backend.controller;

import com.infora.backend.dto.ApiResponse;
import com.infora.backend.dto.UserRequest;
import com.infora.backend.model.User;
import com.infora.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "User management endpoints")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/{userId}")
    @Operation(summary = "Create or update a user profile")
    public ResponseEntity<ApiResponse<User>> createOrUpdate(
            @PathVariable String userId,
            @Valid @RequestBody UserRequest request) {
        User user = userService.createOrUpdate(userId, request);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get a user profile")
    public ResponseEntity<ApiResponse<User>> getUser(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getUser(userId)));
    }

    @PatchMapping("/{userId}/language")
    @Operation(summary = "Update user preferred language")
    public ResponseEntity<ApiResponse<String>> updateLanguage(
            @PathVariable String userId,
            @RequestBody Map<String, String> body) {
        userService.updateLanguage(userId, body.get("language"));
        return ResponseEntity.ok(ApiResponse.ok("Language updated"));
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Delete a user")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.ok("User deleted"));
    }
}
