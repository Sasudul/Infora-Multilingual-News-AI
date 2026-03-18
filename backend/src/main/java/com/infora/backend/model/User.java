package com.infora.backend.model;

import java.time.Instant;

public class User {
    private String id;
    private String name;
    private String email;
    private String preferredLanguage; // "en", "si", "ta"
    private Instant createdAt;

    public User() {}

    public User(String id, String name, String email, String preferredLanguage, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.preferredLanguage = preferredLanguage;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
