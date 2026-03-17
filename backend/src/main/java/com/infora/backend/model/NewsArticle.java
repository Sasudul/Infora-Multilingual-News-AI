package com.infora.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsArticle {
    private String id;
    private String titleEn;
    private String titleSi;
    private String summaryEn;
    private String summarySi;
    private String source;
    private String sourceUrl;
    private String url;
    private String imageUrl;
    private Instant publishedAt;
    private String district;
    private String category;
    private boolean verified;
}
