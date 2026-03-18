package com.infora.backend.service;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.infora.backend.model.NewsArticle;
import com.infora.backend.repository.NewsRepository;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
@Service
public class NewsScraperService {

    private static final Logger log = LoggerFactory.getLogger(NewsScraperService.class);

    private final NewsRepository newsRepository;

    public NewsScraperService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    @Value("${news.sources.ada-derana:https://www.adaderana.lk/rss.php}")
    private String adaDeranaUrl;

    @Value("${news.sources.daily-mirror:https://www.dailymirror.lk/rss}")
    private String dailyMirrorUrl;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(20, TimeUnit.SECONDS)
            .followRedirects(true)
            .build();

    private final XmlMapper xmlMapper = new XmlMapper();

    /**
     * Runs every 15 minutes to fetch latest news articles.
     * Initial delay of 10 seconds to let the app fully start.
     */
    @Scheduled(fixedRateString = "${news.scraper.interval:900000}", initialDelay = 10000)
    public void scrapeAllSources() {
        log.info("Starting news scrape cycle...");
        int total = 0;
        total += scrapeRssFeed("Ada Derana", adaDeranaUrl, "https://www.adaderana.lk");
        total += scrapeRssFeed("Daily Mirror", dailyMirrorUrl, "https://www.dailymirror.lk");
        log.info("News scrape cycle complete. Total articles saved: {}", total);
    }

    @SuppressWarnings("unchecked")
    private int scrapeRssFeed(String sourceName, String feedUrl, String sourceUrl) {
        try {
            Request request = new Request.Builder()
                    .url(feedUrl)
                    .header("User-Agent", "Mozilla/5.0 (compatible; Infora-NewsBot/1.0)")
                    .header("Accept", "application/rss+xml, application/xml, text/xml, */*")
                    .build();

            try (Response response = httpClient.newCall(request).execute()) {
                if (!response.isSuccessful() || response.body() == null) {
                    log.warn("Failed to fetch RSS from {}: HTTP {}", sourceName, response.code());
                    return 0;
                }

                String xml = response.body().string();

                // Clean common XML issues
                xml = xml.trim();
                if (xml.startsWith("\uFEFF")) {
                    xml = xml.substring(1); // Remove BOM
                }

                // Try to parse as RSS
                Map<String, Object> rss;
                try {
                    rss = xmlMapper.readValue(xml, Map.class);
                } catch (Exception parseEx) {
                    // Try removing problematic characters before the XML declaration
                    int xmlStart = xml.indexOf("<?xml");
                    if (xmlStart > 0) {
                        xml = xml.substring(xmlStart);
                        try {
                            rss = xmlMapper.readValue(xml, Map.class);
                        } catch (Exception e2) {
                            log.warn("Cannot parse RSS from {}: {}", sourceName, e2.getMessage());
                            return 0;
                        }
                    } else {
                        log.warn("Cannot parse RSS from {}: {}", sourceName, parseEx.getMessage());
                        return 0;
                    }
                }

                Object channelObj = rss.get("channel");
                if (channelObj == null) {
                    log.warn("No channel element found in RSS from {}", sourceName);
                    return 0;
                }

                Map<String, Object> channel = (Map<String, Object>) channelObj;
                Object itemsObj = channel.get("item");
                if (itemsObj == null) {
                    log.warn("No items found in RSS from {}", sourceName);
                    return 0;
                }

                List<Map<String, Object>> items;
                if (itemsObj instanceof List) {
                    items = (List<Map<String, Object>>) itemsObj;
                } else if (itemsObj instanceof Map) {
                    items = List.of((Map<String, Object>) itemsObj);
                } else {
                    log.warn("Unexpected items format in RSS from {}", sourceName);
                    return 0;
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
                            description = description.replaceAll("&amp;", "&")
                                    .replaceAll("&lt;", "<")
                                    .replaceAll("&gt;", ">")
                                    .replaceAll("&quot;", "\"")
                                    .replaceAll("&#39;", "'");
                            if (description.length() > 300) {
                                description = description.substring(0, 297) + "...";
                            }
                        }

                        NewsArticle article = new NewsArticle();
                        article.setId(generateArticleId(sourceName, title));
                        article.setTitleEn(title.trim());
                        article.setSummaryEn(description);
                        article.setSource(sourceName);
                        article.setSourceUrl(sourceUrl);
                        article.setUrl(link);
                        article.setCategory(categorizeArticle(title));
                        article.setDistrict("Colombo");
                        article.setPublishedAt(Instant.now());
                        article.setVerified(true);

                        newsRepository.save(article);
                        count++;
                    } catch (Exception e) {
                        log.debug("Skipping item from {}: {}", sourceName, e.getMessage());
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
        if (val == null) return null;
        if (val instanceof String) return (String) val;
        if (val instanceof Map) {
            // Some RSS feeds wrap text in nested elements
            Map<?, ?> nested = (Map<?, ?>) val;
            Object content = nested.get("");
            if (content != null) return content.toString();
            // Try getting first value
            for (Object v : nested.values()) {
                if (v instanceof String) return (String) v;
            }
        }
        return val.toString();
    }

    private String generateArticleId(String source, String title) {
        return source.toLowerCase().replace(" ", "-") + "-" +
                Math.abs(title.hashCode());
    }

    /**
     * Basic keyword-based categorization.
     */
    private String categorizeArticle(String title) {
        String t = title.toLowerCase();
        if (t.contains("parliament") || t.contains("minister") || t.contains("election") ||
            t.contains("president") || t.contains("government") || t.contains("mp ") ||
            t.contains("cabinet") || t.contains("opposition")) return "politics";
        if (t.contains("economy") || t.contains("bank") || t.contains("rupee") ||
            t.contains("export") || t.contains("gdp") || t.contains("inflation") ||
            t.contains("tax") || t.contains("budget") || t.contains("revenue")) return "economy";
        if (t.contains("cricket") || t.contains("sport") || t.contains("rugby") ||
            t.contains("olympics") || t.contains("match") || t.contains("football")) return "sports";
        if (t.contains("tech") || t.contains("digital") || t.contains("software") ||
            t.contains("internet") || t.contains("ai") || t.contains("startup")) return "technology";
        if (t.contains("india") || t.contains("china") || t.contains("us ") ||
            t.contains("world") || t.contains("global") || t.contains("un ") ||
            t.contains("russia") || t.contains("ukraine")) return "international";
        return "local";
    }
}
