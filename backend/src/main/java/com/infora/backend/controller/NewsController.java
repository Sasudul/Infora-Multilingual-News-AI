package com.infora.backend.controller;

import com.infora.backend.dto.ApiResponse;
import com.infora.backend.model.NewsArticle;
import com.infora.backend.service.NewsService;
import com.infora.backend.service.NewsScraperService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/news")
@Tag(name = "News", description = "News retrieval endpoints")
public class NewsController {

    private final NewsService newsService;
    private final NewsScraperService newsScraperService;

    public NewsController(NewsService newsService, NewsScraperService newsScraperService) {
        this.newsService = newsService;
        this.newsScraperService = newsScraperService;
    }

    @GetMapping
    @Operation(summary = "Get latest news articles")
    public ResponseEntity<ApiResponse<List<NewsArticle>>> getLatestNews(
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(newsService.getLatestNews(limit)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single news article by ID")
    public ResponseEntity<ApiResponse<NewsArticle>> getArticle(@PathVariable String id) {
        return newsService.getArticle(id)
                .map(article -> ResponseEntity.ok(ApiResponse.ok(article)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get news by category")
    public ResponseEntity<ApiResponse<List<NewsArticle>>> getByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(newsService.getNewsByCategory(category, limit)));
    }

    @GetMapping("/district/{district}")
    @Operation(summary = "Get news by district")
    public ResponseEntity<ApiResponse<List<NewsArticle>>> getByDistrict(
            @PathVariable String district,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(newsService.getNewsByDistrict(district, limit)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search news articles")
    public ResponseEntity<ApiResponse<List<NewsArticle>>> searchNews(
            @RequestParam String q,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(newsService.searchNews(q, limit)));
    }

    @PostMapping("/scrape")
    @Operation(summary = "Trigger manual news scrape (admin only)")
    public ResponseEntity<ApiResponse<String>> triggerScrape() {
        newsScraperService.scrapeAllSources();
        return ResponseEntity.ok(ApiResponse.ok("News scrape triggered successfully"));
    }
}
