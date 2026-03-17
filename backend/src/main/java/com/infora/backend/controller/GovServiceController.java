package com.infora.backend.controller;

import com.infora.backend.dto.ApiResponse;
import com.infora.backend.model.GovService;
import com.infora.backend.service.GovServiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
@Tag(name = "Government Services", description = "Government service guidance endpoints")
public class GovServiceController {

    private final GovServiceService govServiceService;

    @GetMapping
    @Operation(summary = "Get all government services")
    public ResponseEntity<ApiResponse<List<GovService>>> getAllServices() {
        return ResponseEntity.ok(ApiResponse.ok(govServiceService.getAllServices()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a specific government service by ID")
    public ResponseEntity<ApiResponse<GovService>> getService(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(govServiceService.getService(id)));
    }
}
