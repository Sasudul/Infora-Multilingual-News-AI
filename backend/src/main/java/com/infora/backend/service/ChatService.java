package com.infora.backend.service;

import com.infora.backend.dto.ChatRequest;
import com.infora.backend.dto.ChatResponse;
import com.infora.backend.model.ChatSession;
import com.infora.backend.model.Message;
import com.infora.backend.model.NewsArticle;
import com.infora.backend.model.GovService;
import com.infora.backend.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final NewsService newsService;
    private final GovServiceService govServiceService;

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
        Message userMsg = Message.builder()
                .role("user")
                .content(request.getMessage())
                .type("text")
                .timestamp(Instant.now())
                .build();
        chatRepository.addMessage(session.getId(), userMsg);

        // Process intent and generate response
        ChatResponse response = detectIntentAndRespond(
                request.getMessage(), request.getLanguage());
        response.setSessionId(session.getId());

        // Save assistant response
        Message assistantMsg = Message.builder()
                .role("assistant")
                .content(response.getReply().getContent())
                .type(response.getCards() != null && !response.getCards().isEmpty() ? "card" : "text")
                .timestamp(Instant.now())
                .build();
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
        String replyText;

        if (containsNewsIntent(query)) {
            replyText = getLocalizedText(language,
                    "Here are the latest news articles from verified Sri Lankan sources:",
                    "සත්‍යාපිත ශ්‍රී ලාංකික මූලාශ්‍ර වලින් නවතම පුවත් ලිපි මෙන්න:",
                    "சரிபார்க்கப்பட்ட இலங்கை ஆதாரங்களிலிருந்து சமீபத்திய செய்திக் கட்டுரைகள்:");

            List<NewsArticle> articles = newsService.getLatestNews(3);
            if (!articles.isEmpty()) {
                cards = articles.stream()
                        .map(a -> ChatResponse.ResponseCard.builder()
                                .title(a.getTitleEn() != null ? a.getTitleEn() : "News Article")
                                .description(a.getSummaryEn() != null ? a.getSummaryEn() : "")
                                .type("news")
                                .source(a.getSource())
                                .sourceUrl(a.getSourceUrl())
                                .verified(a.isVerified())
                                .build())
                        .collect(Collectors.toList());
            } else {
                cards.add(ChatResponse.ResponseCard.builder()
                        .title("Latest Sri Lankan News")
                        .description("Check verified sources: Ada Derana, Daily Mirror, NewsFirst")
                        .type("news")
                        .source("Multiple Sources")
                        .verified(true)
                        .build());
            }

        } else if (containsPassportIntent(query)) {
            replyText = getLocalizedText(language,
                    "Here's a guide to the Passport Application process:",
                    "ගමන් බලපත්‍ර අයදුම් ක්‍රියාවලිය පිළිබඳ මාර්ගෝපදේශනය:",
                    "கடவுச்சீட்டு விண்ணப்ப செயல்முறை வழிகாட்டி:");
            cards = getServiceCards("passport");

        } else if (containsNicIntent(query)) {
            replyText = getLocalizedText(language,
                    "Here's how to register for a National Identity Card:",
                    "ජාතික හැඳුනුම්පත සඳහා ලියාපදිංචි වන ආකාරය:",
                    "தேசிய அடையாள அட்டைக்கு பதிவு செய்வது எப்படி:");
            cards = getServiceCards("nic");

        } else if (containsDrivingIntent(query)) {
            replyText = getLocalizedText(language,
                    "Here's the driving license application process:",
                    "රියදුරු බලපත්‍ර අයදුම් ක්‍රියාවලිය:",
                    "ஓட்டுநர் உரிமம் விண்ணப்ப செயல்முறை:");
            cards = getServiceCards("driving-license");

        } else {
            replyText = getLocalizedText(language,
                    "I can help you with Sri Lankan news, government services, and general information. Try asking about passports, NIC registration, latest news, or any government service!",
                    "මට ශ්‍රී ලංකාවේ පුවත්, රජයේ සේවා සහ සාමාන්‍ය තොරතුරු සම්බන්ධයෙන් ඔබට උදව් කළ හැකිය.",
                    "இலங்கை செய்திகள், அரசாங்க சேவைகள் மற்றும் பொதுவான தகவல்களில் நான் உங்களுக்கு உதவ முடியும்.");
            cards.add(ChatResponse.ResponseCard.builder()
                    .title("Browse News").description("Get the latest headlines from verified Sri Lankan sources.")
                    .type("info").build());
            cards.add(ChatResponse.ResponseCard.builder()
                    .title("Government Services").description("Step-by-step guides for passports, NIC, driving license & more.")
                    .type("info").build());
        }

        Message reply = Message.builder()
                .role("assistant")
                .content(replyText)
                .type(cards.isEmpty() ? "text" : "card")
                .timestamp(Instant.now())
                .build();

        return ChatResponse.builder()
                .reply(reply)
                .cards(cards)
                .build();
    }

    private List<ChatResponse.ResponseCard> getServiceCards(String serviceId) {
        List<ChatResponse.ResponseCard> cards = new ArrayList<>();
        try {
            GovService svc = govServiceService.getService(serviceId);
            if (svc.getSteps() != null) {
                for (int i = 0; i < Math.min(svc.getSteps().size(), 3); i++) {
                    cards.add(ChatResponse.ResponseCard.builder()
                            .title("Step " + (i + 1))
                            .description(svc.getSteps().get(i))
                            .type("service")
                            .source(svc.getOfficialSource())
                            .sourceUrl(svc.getOfficialUrl())
                            .verified(true)
                            .build());
                }
            }
        } catch (Exception e) {
            log.warn("Service not found in DB, using fallback: {}", serviceId);
            cards.add(ChatResponse.ResponseCard.builder()
                    .title("Service Guide")
                    .description("Visit the official government website for detailed instructions.")
                    .type("service")
                    .verified(true)
                    .build());
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
