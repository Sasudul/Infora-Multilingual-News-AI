package com.infora.backend.service;

import com.infora.backend.model.NewsArticle;
import com.infora.backend.repository.NewsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NewsService {

    private static final Logger log = LoggerFactory.getLogger(NewsService.class);

    private final NewsRepository newsRepository;

    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    public List<NewsArticle> getLatestNews(int limit) {
        return newsRepository.findAll(Math.min(limit, 500));
    }

    public List<NewsArticle> getNewsByCategory(String category, int limit) {
        return newsRepository.findByCategory(category, Math.min(limit, 500));
    }

    public List<NewsArticle> getNewsByDistrict(String district, int limit) {
        return newsRepository.findByDistrict(district, Math.min(limit, 500));
    }

    public Optional<NewsArticle> getArticle(String id) {
        return newsRepository.findById(id);
    }

    public List<NewsArticle> searchNews(String query, int limit) {
        return newsRepository.search(query, Math.min(limit, 500));
    }

    public NewsArticle saveArticle(NewsArticle article) {
        return newsRepository.save(article);
    }
}
