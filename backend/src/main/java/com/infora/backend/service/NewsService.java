package com.infora.backend.service;

import com.infora.backend.model.NewsArticle;
import com.infora.backend.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;

    public List<NewsArticle> getLatestNews(int limit) {
        return newsRepository.findAll(Math.min(limit, 50));
    }

    public List<NewsArticle> getNewsByCategory(String category, int limit) {
        return newsRepository.findByCategory(category, Math.min(limit, 50));
    }

    public List<NewsArticle> getNewsByDistrict(String district, int limit) {
        return newsRepository.findByDistrict(district, Math.min(limit, 50));
    }

    public Optional<NewsArticle> getArticle(String id) {
        return newsRepository.findById(id);
    }

    public List<NewsArticle> searchNews(String query, int limit) {
        return newsRepository.search(query, Math.min(limit, 50));
    }

    public NewsArticle saveArticle(NewsArticle article) {
        return newsRepository.save(article);
    }
}
