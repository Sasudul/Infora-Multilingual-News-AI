package com.infora.backend.service;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class TranslationService {
    private static final Logger log = LoggerFactory.getLogger(TranslationService.class);
    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public String translate(String text, String targetLang) {
        if (text == null || text.isBlank() || text.length() < 3) return text;
        
        try {
            // Free undocumented Google Translate API suitable for our NLP-like live translation of raw news.
            String url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" 
                         + targetLang + "&dt=t&q=" + URLEncoder.encode(text, StandardCharsets.UTF_8);
            
            Request request = new Request.Builder().url(url).build();
            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful() || response.body() == null) {
                    return text;
                }
                String responseBody = response.body().string();
                List<?> parsed = mapper.readValue(responseBody, List.class);
                if (parsed == null || parsed.isEmpty() || parsed.get(0) == null) return text;
                
                List<?> parts = (List<?>) parsed.get(0);
                StringBuilder sb = new StringBuilder();
                for (Object partObj : parts) {
                    if (partObj instanceof List) {
                        List<?> part = (List<?>) partObj;
                        if (!part.isEmpty() && part.get(0) != null) {
                            sb.append(part.get(0).toString());
                        }
                    }
                }
                return sb.toString();
            }
        } catch (Exception e) {
            log.debug("Live translation failed for '{}': {}", text, e.getMessage());
            return text;
        }
    }
}
