package com.infora.backend.repository;

import com.google.cloud.firestore.*;
import com.infora.backend.model.NewsArticle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class NewsRepository {

    private static final Logger log = LoggerFactory.getLogger(NewsRepository.class);

    private final Firestore firestore;
    private static final String COLLECTION = "newsCache";

    public NewsRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public NewsArticle save(NewsArticle article) {
        try {
            String docId = article.getId() != null ? article.getId() : UUID.randomUUID().toString();
            article.setId(docId);

            Map<String, Object> data = new HashMap<>();
            data.put("title_en", article.getTitleEn());
            data.put("title_si", article.getTitleSi());
            data.put("summary_en", article.getSummaryEn());
            data.put("summary_si", article.getSummarySi());
            data.put("source", article.getSource());
            data.put("sourceUrl", article.getSourceUrl());
            data.put("url", article.getUrl());
            data.put("imageUrl", article.getImageUrl());
            data.put("publishedAt", article.getPublishedAt() != null
                    ? article.getPublishedAt().toString() : Instant.now().toString());
            data.put("district", article.getDistrict());
            data.put("category", article.getCategory());
            data.put("verified", article.isVerified());

            firestore.collection(COLLECTION).document(docId).set(data).get();
            log.info("News article saved: {}", docId);
            return article;
        } catch (Exception e) {
            log.error("Failed to save news article", e);
            throw new RuntimeException("Failed to save news article", e);
        }
    }

    public List<NewsArticle> findAll(int limit) {
        try {
            QuerySnapshot snapshot = firestore.collection(COLLECTION)
                    .orderBy("publishedAt", Query.Direction.DESCENDING)
                    .limit(limit)
                    .get().get();
            return snapshot.getDocuments().stream()
                    .map(this::documentToArticle)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to fetch news articles", e);
            throw new RuntimeException("Failed to fetch news", e);
        }
    }

    public List<NewsArticle> findByCategory(String category, int limit) {
        try {
            QuerySnapshot snapshot = firestore.collection(COLLECTION)
                    .whereEqualTo("category", category)
                    .orderBy("publishedAt", Query.Direction.DESCENDING)
                    .limit(limit)
                    .get().get();
            return snapshot.getDocuments().stream()
                    .map(this::documentToArticle)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to fetch news by category: {}", category, e);
            throw new RuntimeException("Failed to fetch news by category", e);
        }
    }

    public List<NewsArticle> findByDistrict(String district, int limit) {
        try {
            QuerySnapshot snapshot = firestore.collection(COLLECTION)
                    .whereEqualTo("district", district)
                    .orderBy("publishedAt", Query.Direction.DESCENDING)
                    .limit(limit)
                    .get().get();
            return snapshot.getDocuments().stream()
                    .map(this::documentToArticle)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to fetch news by district: {}", district, e);
            throw new RuntimeException("Failed to fetch news by district", e);
        }
    }

    public Optional<NewsArticle> findById(String id) {
        try {
            DocumentSnapshot doc = firestore.collection(COLLECTION).document(id).get().get();
            if (!doc.exists()) return Optional.empty();
            return Optional.of(documentToArticle(doc));
        } catch (Exception e) {
            log.error("Failed to fetch news article: {}", id, e);
            throw new RuntimeException("Failed to fetch news article", e);
        }
    }

    public List<NewsArticle> search(String query, int limit) {
        try {
            // Firestore doesn't support full-text search natively;
            // we fetch recent articles and filter in-memory for now.
            List<NewsArticle> all = findAll(200);
            String q = query.toLowerCase();
            return all.stream()
                    .filter(a ->
                            (a.getTitleEn() != null && a.getTitleEn().toLowerCase().contains(q)) ||
                            (a.getTitleSi() != null && a.getTitleSi().contains(q)) ||
                            (a.getSummaryEn() != null && a.getSummaryEn().toLowerCase().contains(q)))
                    .limit(limit)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to search news: {}", query, e);
            throw new RuntimeException("Failed to search news", e);
        }
    }

    private NewsArticle documentToArticle(DocumentSnapshot doc) {
        NewsArticle article = new NewsArticle();
        article.setId(doc.getId());
        article.setTitleEn(doc.getString("title_en"));
        article.setTitleSi(doc.getString("title_si"));
        article.setSummaryEn(doc.getString("summary_en"));
        article.setSummarySi(doc.getString("summary_si"));
        article.setSource(doc.getString("source"));
        article.setSourceUrl(doc.getString("sourceUrl"));
        article.setUrl(doc.getString("url"));
        article.setImageUrl(doc.getString("imageUrl"));
        article.setPublishedAt(doc.getString("publishedAt") != null
                ? Instant.parse(doc.getString("publishedAt")) : null);
        article.setDistrict(doc.getString("district"));
        article.setCategory(doc.getString("category"));
        article.setVerified(Boolean.TRUE.equals(doc.getBoolean("verified")));
        return article;
    }
}
