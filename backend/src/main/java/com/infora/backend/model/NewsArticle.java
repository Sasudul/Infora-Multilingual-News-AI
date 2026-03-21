package com.infora.backend.model;

import java.time.Instant;

public class NewsArticle {
    private String id;
    private String titleEn;
    private String titleSi;
    private String titleTa;
    private String summaryEn;
    private String summarySi;
    private String summaryTa;
    private String source;
    private String sourceUrl;
    private String url;
    private String imageUrl;
    private Instant publishedAt;
    private String district;
    private String category;
    private boolean verified;

    public NewsArticle() {}

    public NewsArticle(String id, String titleEn, String titleSi, String titleTa, String summaryEn, String summarySi, String summaryTa, String source, String sourceUrl, String url, String imageUrl, Instant publishedAt, String district, String category, boolean verified) {
        this.id = id;
        this.titleEn = titleEn;
        this.titleSi = titleSi;
        this.titleTa = titleTa;
        this.summaryEn = summaryEn;
        this.summarySi = summarySi;
        this.summaryTa = summaryTa;
        this.source = source;
        this.sourceUrl = sourceUrl;
        this.url = url;
        this.imageUrl = imageUrl;
        this.publishedAt = publishedAt;
        this.district = district;
        this.category = category;
        this.verified = verified;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    public String getTitleSi() { return titleSi; }
    public void setTitleSi(String titleSi) { this.titleSi = titleSi; }
    public String getTitleTa() { return titleTa; }
    public void setTitleTa(String titleTa) { this.titleTa = titleTa; }
    public String getSummaryEn() { return summaryEn; }
    public void setSummaryEn(String summaryEn) { this.summaryEn = summaryEn; }
    public String getSummarySi() { return summarySi; }
    public void setSummarySi(String summarySi) { this.summarySi = summarySi; }
    public String getSummaryTa() { return summaryTa; }
    public void setSummaryTa(String summaryTa) { this.summaryTa = summaryTa; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Instant getPublishedAt() { return publishedAt; }
    public void setPublishedAt(Instant publishedAt) { this.publishedAt = publishedAt; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
