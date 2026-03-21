package com.infora.backend.service;

import com.infora.backend.dto.ChatRequest;
import com.infora.backend.dto.ChatResponse;
import com.infora.backend.model.ChatSession;
import com.infora.backend.model.Message;
import com.infora.backend.model.NewsArticle;
import com.infora.backend.model.GovService;
import com.infora.backend.repository.ChatRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Chat orchestration service.
 *
 * Currently uses keyword-based intent detection (demo mode).
 * In production, this integrates with Rasa NLP for proper
 * intent classification and entity extraction.
 */
@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final ChatRepository chatRepository;
    private final NewsService newsService;
    private final GovServiceService govServiceService;
    private final LlmRAGService llmRAGService;

    public ChatService(ChatRepository chatRepository, NewsService newsService, GovServiceService govServiceService, LlmRAGService llmRAGService) {
        this.chatRepository = chatRepository;
        this.newsService = newsService;
        this.govServiceService = govServiceService;
        this.llmRAGService = llmRAGService;
    }

    public ChatResponse processMessage(String userId, ChatRequest request) {
        // Get or create session
        ChatSession session;
        if (request.getSessionId() != null && !request.getSessionId().isEmpty()) {
            session = chatRepository.findById(request.getSessionId())
                    .orElse(chatRepository.create(userId, request.getLanguage()));
        } else {
            session = chatRepository.create(userId, request.getLanguage());
        }

        // Save user message
        Message userMsg = new Message();
        userMsg.setRole("user");
        userMsg.setContent(request.getMessage());
        userMsg.setType("text");
        userMsg.setTimestamp(Instant.now());
        chatRepository.addMessage(session.getId(), userMsg);

        // Process intent and generate response
        ChatResponse response = detectIntentAndRespond(
                request.getMessage(), request.getLanguage());
        response.setSessionId(session.getId());

        // Save assistant response
        Message assistantMsg = new Message();
        assistantMsg.setRole("assistant");
        assistantMsg.setContent(response.getReply().getContent());
        assistantMsg.setType(response.getCards() != null && !response.getCards().isEmpty() ? "card" : "text");
        assistantMsg.setTimestamp(Instant.now());
        assistantMsg.setCards(response.getCards());
        chatRepository.addMessage(session.getId(), assistantMsg);

        return response;
    }

    public List<ChatSession> getUserSessions(String userId) {
        return chatRepository.findByUserId(userId);
    }

    public ChatSession getSession(String sessionId) {
        return chatRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
    }

    public void deleteSession(String sessionId) {
        chatRepository.delete(sessionId);
    }

    /**
     * Simple keyword-based intent detection (demo).
     * Replace with Rasa NLP integration for production.
     */
    private ChatResponse detectIntentAndRespond(String message, String language) {
        String query = message.toLowerCase();
        List<ChatResponse.ResponseCard> cards = new ArrayList<>();
        StringBuilder contextBuilder = new StringBuilder();

        if (containsNewsIntent(query)) {
            List<NewsArticle> articles = newsService.getLatestNews(3);
            if (!articles.isEmpty()) {
                contextBuilder.append("Latest News context:\n");
                for (NewsArticle a : articles) {
                    contextBuilder.append("- ").append(a.getTitleEn()).append(": ").append(a.getSummaryEn()).append("\n");
                    ChatResponse.ResponseCard card = new ChatResponse.ResponseCard();
                    card.setTitle(a.getTitleEn() != null ? a.getTitleEn() : "News Article");
                    card.setTitleSi(a.getTitleSi());
                    card.setTitleTa(a.getTitleTa());
                    card.setDescription(a.getSummaryEn() != null ? a.getSummaryEn() : "");
                    card.setDescriptionSi(a.getSummarySi());
                    card.setDescriptionTa(a.getSummaryTa());
                    card.setType("news");
                    card.setSource(a.getSource());
                    card.setSourceUrl(a.getSourceUrl());
                    card.setVerified(a.isVerified());
                    card.setImageUrl(a.getImageUrl());
                    card.setDistrict(a.getDistrict());
                    if (a.getPublishedAt() != null) card.setPublishedAt(a.getPublishedAt().toString());
                    cards.add(card);
                }
            }
        } else if (containsPassportIntent(query)) {
            contextBuilder.append("Service context: Passport Application. Steps: Gather NIC, Form K35A, Birth Certificate. Pay LKR 3500.\n");
            cards = getServiceCards("passport");
        } else if (containsNicIntent(query)) {
            contextBuilder.append("Service context: NIC Registration at Department of Registration of Persons. Requires GN cert and Birth cert.\n");
            cards = getServiceCards("nic");
        } else if (containsDrivingIntent(query)) {
            contextBuilder.append("Service context: Driving License. Requires medical certificate and passing written exam. Fee LKR 1500.\n");
            cards = getServiceCards("driving-license");
        } else {
            List<NewsArticle> foundNews = newsService.searchNews(query, 3);
            if (!foundNews.isEmpty()) {
                contextBuilder.append("Relevant News Found in database:\n");
                for (NewsArticle a : foundNews) {
                    contextBuilder.append("- ").append(a.getTitleEn()).append(": ").append(a.getSummaryEn()).append("\n");
                    ChatResponse.ResponseCard card = new ChatResponse.ResponseCard();
                    card.setTitle(a.getTitleEn() != null ? a.getTitleEn() : "News Article");
                    card.setTitleSi(a.getTitleSi());
                    card.setTitleTa(a.getTitleTa());
                    card.setDescription(a.getSummaryEn() != null ? a.getSummaryEn() : "");
                    card.setDescriptionSi(a.getSummarySi());
                    card.setDescriptionTa(a.getSummaryTa());
                    card.setType("news");
                    card.setSource(a.getSource());
                    card.setSourceUrl(a.getSourceUrl());
                    card.setVerified(a.isVerified());
                    card.setImageUrl(a.getImageUrl());
                    card.setDistrict(a.getDistrict());
                    if (a.getPublishedAt() != null) card.setPublishedAt(a.getPublishedAt().toString());
                    cards.add(card);
                }
            } else {
                contextBuilder.append("No strictly relevant news or services found. Provide a friendly conversational response pointing out the capabilities: News and Government Services.");
            }
        }

        // Engage the RAG LLM Engine for a dynamic, intelligent, ChatGPT-like conversational reply!
        String replyText = llmRAGService.generateResponse(message, contextBuilder.toString(), language);

        Message reply = new Message();
        reply.setRole("assistant");
        reply.setContent(replyText);
        reply.setType(cards.isEmpty() ? "text" : "card");
        reply.setTimestamp(Instant.now());

        ChatResponse chatResponse = new ChatResponse();
        chatResponse.setReply(reply);
        chatResponse.setCards(cards);
        return chatResponse;
    }

    private List<ChatResponse.ResponseCard> getServiceCards(String serviceId) {
        List<ChatResponse.ResponseCard> cards = new ArrayList<>();
        try {
            GovService svc = govServiceService.getService(serviceId);
            if (svc.getSteps() != null) {
                for (int i = 0; i < Math.min(svc.getSteps().size(), 3); i++) {
                    ChatResponse.ResponseCard card = new ChatResponse.ResponseCard();
                    card.setTitle("Step " + (i + 1));
                    card.setDescription(svc.getSteps().get(i));
                    card.setType("service");
                    card.setSource(svc.getOfficialSource());
                    card.setSourceUrl(svc.getOfficialUrl());
                    card.setVerified(true);
                    cards.add(card);
                }
            }
        } catch (Exception e) {
            log.warn("Service not found in DB, using fallback: {}", serviceId);
            ChatResponse.ResponseCard card = new ChatResponse.ResponseCard();
            card.setTitle("Service Guide");
            card.setDescription("Visit the official government website for detailed instructions.");
            card.setType("service");
            card.setVerified(true);
            cards.add(card);
        }
        return cards;
    }

    private boolean containsNewsIntent(String q) {
        return q.contains("news") || q.contains("latest") || q.contains("පුවත්") ||
                q.contains("செய்தி") || q.contains("headline");
    }

    private boolean containsPassportIntent(String q) {
        return q.contains("passport") || q.contains("ගමන් බලපත්") || q.contains("கடவுச்சீட்டு");
    }

    private boolean containsNicIntent(String q) {
        return q.contains("nic") || q.contains("identity card") || q.contains("හැඳුනුම්") ||
                q.contains("அடையாள");
    }

    private boolean containsDrivingIntent(String q) {
        return q.contains("driving") || q.contains("license") || q.contains("රියදුරු") ||
                q.contains("ஓட்டுநர்");
    }

    private String getLocalizedText(String lang, String en, String si, String ta) {
        return switch (lang) {
            case "si" -> si;
            case "ta" -> ta;
            default -> en;
        };
    }
}
