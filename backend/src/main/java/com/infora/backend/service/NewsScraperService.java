package com.infora.backend.service;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.infora.backend.model.NewsArticle;
import com.infora.backend.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * Scheduled service that scrapes RSS feeds from verified Sri Lankan news sources,
 * parses the XML, and stores articles in Firestore.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NewsScraperService {

    private final NewsRepository newsRepository;

    @Value("${news.sources.ada-derana:https://www.adaderana.lk/rss.php}")
    private String adaDeranaUrl;

    @Value("${news.sources.daily-mirror:https://www.dailymirror.lk/rss}")
    private String dailyMirrorUrl;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .build();

    /**
     * Runs every 15 minutes to fetch latest news articles.
     * Configurable via application.properties.
     */
    @Scheduled(fixedRateString = "${news.scraper.interval:900000}")
    public void scrapeAllSources() {
        log.info("Starting news scrape cycle...");
        int total = 0;
        total += scrapeRssFeed("Ada Derana", adaDeranaUrl, "https://www.adaderana.lk");
        total += scrapeRssFeed("Daily Mirror", dailyMirrorUrl, "https://www.dailymirror.lk");
        log.info("News scrape cycle complete. Total articles processed: {}", total);
    }

    @SuppressWarnings("unchecked")
    private int scrapeRssFeed(String sourceName, String feedUrl, String sourceUrl) {
        try {
            Request request = new Request.Builder()
                    .url(feedUrl)
                    .header("User-Agent", "Infora-NewsBot/1.0")
                    .build();

            try (Response response = httpClient.newCall(request).execute()) {
                if (!response.isSuccessful() || response.body() == null) {
                    log.warn("Failed to fetch RSS from {}: HTTP {}", sourceName, response.code());
                    return 0;
                }

                String xml = response.body().string();
                XmlMapper xmlMapper = new XmlMapper();
                Map<String, Object> rss = xmlMapper.readValue(xml, Map.class);

                Object channelObj = rss.get("channel");
                if (channelObj == null) {
                    log.warn("No channel element found in RSS from {}", sourceName);
                    return 0;
                }

                Map<String, Object> channel = (Map<String, Object>) channelObj;
                Object itemsObj = channel.get("item");
                if (itemsObj == null) return 0;

                List<Map<String, Object>> items;
                if (itemsObj instanceof List) {
                    items = (List<Map<String, Object>>) itemsObj;
                } else {
                    items = List.of((Map<String, Object>) itemsObj);
                }

                int count = 0;
                for (Map<String, Object> item : items) {
                    try {
                        String title = getStringValue(item, "title");
                        String description = getStringValue(item, "description");
                        String link = getStringValue(item, "link");

                        if (title == null || title.isBlank()) continue;

                        // Clean HTML from description
                        if (description != null) {
                            description = description.replaceAll("<[^>]*>", "").trim();
                            if (description.length() > 300) {
                                description = description.substring(0, 297) + "...";
                            }
                        }

                        NewsArticle article = NewsArticle.builder()
                                .id(generateArticleId(sourceName, title))
                                .titleEn(title)
                                .summaryEn(description)
                                .source(sourceName)
                                .sourceUrl(sourceUrl)
                                .url(link)
                                .category(categorizeArticle(title))
                                .district("Colombo")
                                .publishedAt(Instant.now())
                                .verified(true)
                                .build();

                        newsRepository.save(article);
                        count++;
                    } catch (Exception e) {
                        log.debug("Skipping malformed item from {}", sourceName);
                    }
                }

                log.info("Scraped {} articles from {}", count, sourceName);
                return count;
            }
        } catch (Exception e) {
            log.error("RSS scrape failed for {}: {}", sourceName, e.getMessage());
            return 0;
        }
    }

    private String getStringValue(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val != null ? val.toString() : null;
    }

    private String generateArticleId(String source, String title) {
        return source.toLowerCase().replace(" ", "-") + "-" +
                Math.abs(title.hashCode());
    }

    /**
     * Basic keyword-based categorization. In production, use NLP classification.
     */
    private String categorizeArticle(String title) {
        String t = title.toLowerCase();
        if (t.contains("parliament") || t.contains("minister") || t.contains("election") ||
            t.contains("president") || t.contains("government")) return "politics";
        if (t.contains("economy") || t.contains("bank") || t.contains("rupee") ||
            t.contains("export") || t.contains("gdp") || t.contains("inflation")) return "economy";
        if (t.contains("cricket") || t.contains("sport") || t.contains("rugby") ||
            t.contains("olympics") || t.contains("match")) return "sports";
        if (t.contains("tech") || t.contains("digital") || t.contains("software") ||
            t.contains("internet") || t.contains("ai")) return "technology";
        if (t.contains("colombo") || t.contains("kandy") || t.contains("galle") ||
            t.contains("jaffna") || t.contains("district")) return "local";
        if (t.contains("india") || t.contains("china") || t.contains("us ") ||
            t.contains("world") || t.contains("global")) return "international";
        return "local";
    }
}
