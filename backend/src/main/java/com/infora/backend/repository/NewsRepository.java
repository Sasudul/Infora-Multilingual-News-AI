package com.infora.backend.repository;

import com.google.cloud.firestore.*;
import com.infora.backend.model.NewsArticle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.io.File;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Repository
public class NewsRepository {

    private static final Logger log = LoggerFactory.getLogger(NewsRepository.class);

    private final Firestore firestore;
    private static final String COLLECTION = "newsCache";
    private final Map<String, NewsArticle> memoryCache = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String CACHE_FILE_PATH = "news_cache_fallback.json";

    public NewsRepository(Firestore firestore) {
        this.firestore = firestore;
        objectMapper.findAndRegisterModules();
    }

    @PostConstruct
    public void loadLocalCache() {
        try {
            File cacheFile = new File(CACHE_FILE_PATH);
            if (cacheFile.exists()) {
                Map<String, NewsArticle> savedCache = objectMapper.readValue(cacheFile, new TypeReference<Map<String, NewsArticle>>(){});
                memoryCache.putAll(savedCache);
                log.info("Loaded {} articles from local JSON cache file.", memoryCache.size());
            }
        } catch (Exception e) {
            log.warn("Failed to load local JSON cache: {}", e.getMessage());
        }
    }

    private void saveLocalCache() {
        try {
            objectMapper.writeValue(new File(CACHE_FILE_PATH), memoryCache);
        } catch (Exception e) {
            log.warn("Failed to save to local JSON cache: {}", e.getMessage());
        }
    }

    public boolean existsSimilar(String title) {
        if (title == null || title.isBlank()) return false;
        String[] newWords = title.toLowerCase().replaceAll("[^a-z0-9 ]", "").split("\\s+");
        Set<String> newWordSet = new HashSet<>(Arrays.asList(newWords));
        newWordSet.removeIf(w -> w.length() <= 3); // Ignore short words/stop words

        if (newWordSet.isEmpty()) return false;
        
        // Only compare against last 48 hours to prevent stale false positives
        Instant recentThreshold = Instant.now().minus(java.time.Duration.ofHours(48));

        for (NewsArticle article : memoryCache.values()) {
            if (article.getPublishedAt() != null && article.getPublishedAt().isBefore(recentThreshold)) continue;
            if (article.getTitleEn() == null) continue;

            String[] existingWords = article.getTitleEn().toLowerCase().replaceAll("[^a-z0-9 ]", "").split("\\s+");
            Set<String> existingWordSet = new HashSet<>(Arrays.asList(existingWords));
            existingWordSet.removeIf(w -> w.length() <= 3);

            int matchCount = 0;
            for (String w : newWordSet) {
                if (existingWordSet.contains(w)) matchCount++;
            }

            // If heavy keyword overlap, it's covering the same topic/event
            double overlapScore = (double) matchCount / Math.max(newWordSet.size(), 1);
            if (overlapScore >= 0.55) {
                return true; 
            }
        }
        return false;
    }

    public NewsArticle save(NewsArticle article) {
        String docId = article.getId() != null ? article.getId() : UUID.randomUUID().toString();
        article.setId(docId);
        memoryCache.put(docId, article); // Always cache locally so app never feels 'fake' or empty

        try {
            Map<String, Object> data = new HashMap<>();
            data.put("title_en", article.getTitleEn());
            data.put("title_si", article.getTitleSi());
            data.put("title_ta", article.getTitleTa());
            data.put("summary_en", article.getSummaryEn());
            data.put("summary_si", article.getSummarySi());
            data.put("summary_ta", article.getSummaryTa());
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
            log.info("News article saved to Firestore: {}", docId);
        } catch (Exception e) {
            log.warn("Failed to save to Firestore (offline/blocked?), kept securely in memory cache: {}", e.getMessage());
        }
        
        // Persist local cache file periodically/on save
        if (memoryCache.size() % 5 == 0) {
            saveLocalCache();
        }
        return article;
    }

    private List<NewsArticle> getFromMemoryCache(int limit, String filterKey, String filterValue) {
        return memoryCache.values().stream()
                .filter(a -> {
                    if (filterKey == null) return true;
                    if ("category".equals(filterKey)) return filterValue.equals(a.getCategory());
                    if ("district".equals(filterKey)) return filterValue.equals(a.getDistrict());
                    return true;
                })
                .sorted((a, b) -> {
                    Instant t1 = a.getPublishedAt() != null ? a.getPublishedAt() : Instant.EPOCH;
                    Instant t2 = b.getPublishedAt() != null ? b.getPublishedAt() : Instant.EPOCH;
                    return t2.compareTo(t1);
                })
                .limit(limit)
                .collect(Collectors.toList());
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
            log.warn("Firestore fetch failed, returning fresh {} articles from memory cache", memoryCache.size());
            return getFromMemoryCache(limit, null, null);
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
            log.warn("Firestore fetch failed, returning from memory cache");
            return getFromMemoryCache(limit, "category", category);
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
            log.warn("Firestore fetch failed, returning from memory cache");
            return getFromMemoryCache(limit, "district", district);
        }
    }

    public Optional<NewsArticle> findById(String id) {
        try {
            DocumentSnapshot doc = firestore.collection(COLLECTION).document(id).get().get();
            if (!doc.exists()) return Optional.ofNullable(memoryCache.get(id));
            return Optional.of(documentToArticle(doc));
        } catch (Exception e) {
            log.warn("Firestore fetch failed, returning from memory cache");
            return Optional.ofNullable(memoryCache.get(id));
        }
    }

    public List<NewsArticle> search(String query, int limit) {
        try {
            // Firestore doesn't support full-text search natively;
            // we fetch recent articles and filter in-memory for now.
            List<NewsArticle> all = findAll(200);
            String[] terms = query.toLowerCase().split("\\s+");
            List<String> validTerms = Arrays.stream(terms).filter(t -> t.length() > 2).collect(Collectors.toList());
            final List<String> finalTerms = validTerms.isEmpty() ? Arrays.asList(terms) : validTerms;
            
            return all.stream()
                    .filter(a -> {
                        for (String q : finalTerms) {
                            if ((a.getTitleEn() != null && a.getTitleEn().toLowerCase().contains(q)) ||
                                (a.getTitleSi() != null && a.getTitleSi().contains(q)) ||
                                (a.getSummaryEn() != null && a.getSummaryEn().toLowerCase().contains(q))) {
                                return true;
                            }
                        }
                        return false;
                    })
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
        article.setTitleTa(doc.getString("title_ta"));
        article.setSummaryEn(doc.getString("summary_en"));
        article.setSummarySi(doc.getString("summary_si"));
        article.setSummaryTa(doc.getString("summary_ta"));
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
