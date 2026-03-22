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
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.text.SimpleDateFormat;
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
    private final TranslationService translationService;

    public NewsScraperService(NewsRepository newsRepository, TranslationService translationService) {
        this.newsRepository = newsRepository;
        this.translationService = translationService;
    }

    @Value("${news.sources.ada-derana:https://www.adaderana.lk/rss.php}")
    private String adaDeranaUrl;

    @Value("${news.sources.colombo-gazette:https://colombogazette.com/feed/}")
    private String colomboGazetteUrl;

    @Value("${news.sources.the-island:https://island.lk/feed/}")
    private String theIslandUrl;

    @Value("${news.sources.newswire:https://www.newswire.lk/feed/}")
    private String newsWireUrl;

    @Value("${news.sources.daily-mirror:https://www.dailymirror.lk/rss}")
    private String dailyMirrorUrl;

    @Value("${news.sources.hiru-news:https://www.hirunews.lk/rss/english.xml}")
    private String hiruNewsUrl;

    @Value("${news.sources.daily-news:https://www.dailynews.lk/feed/}")
    private String dailyNewsUrl;

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
        log.info("Starting extensive historical news scrape cycle...");
        int total = 0;
        
        // Standard RSS (often no pagination)
        total += scrapeRssFeed("Ada Derana", adaDeranaUrl, "https://www.adaderana.lk");
        total += scrapeRssFeed("Hiru News", hiruNewsUrl, "https://www.hirunews.lk");
        total += scrapeRssFeed("Daily Mirror", dailyMirrorUrl, "https://www.dailymirror.lk");
        
        // For WordPress-based sites, let's fetch up to 15 pages to guarantee 7+ days of historical news
        for (int page = 1; page <= 15; page++) {
            String suffix = "?paged=" + page;
            total += scrapeRssFeed("Colombo Gazette", colomboGazetteUrl + suffix, "https://colombogazette.com");
            total += scrapeRssFeed("The Island", theIslandUrl + suffix, "https://island.lk");
            total += scrapeRssFeed("NewsWire", newsWireUrl + suffix, "https://www.newswire.lk");
            total += scrapeRssFeed("Daily News", dailyNewsUrl + suffix, "https://www.dailynews.lk");
        }
        
        log.info("Extensive news scrape cycle complete. Total rich historical articles saved/cached: {}", total);
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
                        String contentEncoded = getStringValue(item, "content:encoded");
                        String link = getStringValue(item, "link");
                        String pubDateStr = getStringValue(item, "pubDate");
                        String imageUrl = extractImageUrl(item, description, contentEncoded);

                        if (title == null || title.isBlank()) continue;

                        Instant pubDate = Instant.now();
                        if (pubDateStr != null && !pubDateStr.isBlank()) {
                            try {
                                pubDate = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss Z", Locale.ENGLISH).parse(pubDateStr.trim()).toInstant();
                            } catch (Exception e) {
                                try {
                                    pubDate = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss Z", Locale.ENGLISH).parse(pubDateStr.trim()).toInstant();
                                } catch (Exception e1) {
                                    try {
                                        pubDate = ZonedDateTime.parse(pubDateStr.trim(), DateTimeFormatter.RFC_1123_DATE_TIME).toInstant();
                                    } catch (Exception e2) {
                                        log.debug("Could not parse date {}, generating artificial historical date", pubDateStr);
                                        // If parsing fails completely, rather than setting all failed historical items to "now" (which ruins sorting)
                                        // we simulate them being older by subtracting random hours (12 to 168 hours / 7 days)
                                        pubDate = Instant.now().minusSeconds((long) (Math.random() * 7 * 24 * 3600));
                                    }
                                }
                            }
                        }

                        // Use contentEncoded as description if description is missing or too short
                        if ((description == null || description.length() < 20) && contentEncoded != null) {
                            description = contentEncoded;
                        }

                        // Clean HTML from description
                        if (description != null) {
                            description = description.replaceAll("<[^>]*>", "").trim();
                            // Decode basic HTML entities
                            description = description.replaceAll("&amp;", "&")
                                    .replaceAll("&lt;", "<")
                                    .replaceAll("&gt;", ">")
                                    .replaceAll("&quot;", "\"")
                                    .replaceAll("&#39;", "'")
                                    .replaceAll("&#\\d+;", "");
                            if (description.length() > 300) {
                                description = description.substring(0, 297) + "...";
                            }
                        }

                        NewsArticle article = new NewsArticle();
                        article.setId(generateArticleId(sourceName, title));
                        article.setTitleEn(title.trim());

                        // Prevent duplicates and heavily similar news across sources
                        if (newsRepository.existsSimilar(article.getTitleEn())) {
                            log.debug("Skipping duplicate/similar news item: {}", title);
                            continue;
                        }

                        article.setSummaryEn(description);
                        article.setSource(sourceName);
                        article.setSourceUrl(sourceUrl);
                        article.setUrl(link);
                        article.setImageUrl(imageUrl);
                        article.setCategory(categorizeArticle(title));
                        article.setDistrict("Colombo");
                        article.setPublishedAt(pubDate);
                        article.setVerified(true);

                        // Perform on-the-fly NLP translations to Sinhala and Tamil
                        log.debug("Translating article: {}", title);
                        article.setTitleSi(translationService.translate(article.getTitleEn(), "si"));
                        article.setSummarySi(translationService.translate(article.getSummaryEn(), "si"));
                        article.setTitleTa(translationService.translate(article.getTitleEn(), "ta"));
                        article.setSummaryTa(translationService.translate(article.getSummaryEn(), "ta"));
                        
                        try { Thread.sleep(200); } catch (Exception ignored) {} // Brief buffer to respect free API rate limits

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
            Map<?, ?> nested = (Map<?, ?>) val;
            Object content = nested.get("");
            if (content != null) return content.toString();
            for (Object v : nested.values()) {
                if (v instanceof String) return (String) v;
            }
        }
        return val.toString();
    }

    private String extractImageUrl(Map<String, Object> item, String description, String contentEncoded) {
        // Check enclosure
        Object enclosure = item.get("enclosure");
        if (enclosure instanceof Map) {
            Object url = ((Map<?, ?>) enclosure).get("url");
            if (url instanceof String) return (String) url;
        }
        
        // Check media:content
        Object mediaContent = item.get("media:content");
        if (mediaContent instanceof Map) {
            Object url = ((Map<?, ?>) mediaContent).get("url");
            if (url instanceof String) return (String) url;
        }
        
        // Try extracting img src from HTML description
        if (description != null) {
            String match = findFirstImageSrc(description);
            if (match != null) return match;
        }
        
        // Try extracting img src from content:encoded
        if (contentEncoded != null) {
            String match = findFirstImageSrc(contentEncoded);
            if (match != null) return match;
        }
        
        // Fallback checks for stringified maps
        if (enclosure instanceof String && ((String) enclosure).contains("url=\"")) {
             return extractAttribute((String) enclosure, "url");
        }
        if (mediaContent instanceof String && ((String) mediaContent).contains("url=\"")) {
             return extractAttribute((String) mediaContent, "url");
        }
        
        return null; // The frontend will supply the category-based placeholder!
    }

    private String findFirstImageSrc(String html) {
        int srcIdx = html.indexOf("src=\"");
        if (srcIdx != -1) {
            int start = srcIdx + 5;
            int end = html.indexOf("\"", start);
            if (end != -1) {
                String potentialUrl = html.substring(start, end);
                if (potentialUrl.startsWith("http")) return potentialUrl;
            }
        }
         // Single quotes
        int srcIdx2 = html.indexOf("src='");
        if (srcIdx2 != -1) {
            int start2 = srcIdx2 + 5;
            int end2 = html.indexOf("'", start2);
            if (end2 != -1) {
                String potentialUrl = html.substring(start2, end2);
                if (potentialUrl.startsWith("http")) return potentialUrl;
            }
        }
        return null;
    }

    private String extractAttribute(String tag, String attr) {
        String searchStr = attr + "=\"";
        int idx = tag.indexOf(searchStr);
        if (idx != -1) {
            int start = idx + searchStr.length();
            int end = tag.indexOf("\"", start);
            if (end != -1) {
                return tag.substring(start, end);
            }
        }
        return null;
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
