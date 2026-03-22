package com.infora.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import okhttp3.*;

import java.util.concurrent.TimeUnit;

@Service
public class LlmRAGService {

    private static final Logger log = LoggerFactory.getLogger(LlmRAGService.class);

    // Provide your OpenAI (or compatible API) key in application.properties or ENV flag 
    // e.g. llm.api.key=sk-proj-xyz...
    @Value("${llm.api.key:}")
    private String apiKey;

    // Defaulting to OpenAI's endpoint, but can be changed to Groq or local LLMs
    @Value("${llm.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;
    
    @Value("${llm.api.model:gpt-4o-mini}")
    private String modelName;

    private final OkHttpClient client;
    private final ObjectMapper mapper;

    public LlmRAGService() {
        this.client = new OkHttpClient.Builder()
                .connectTimeout(15, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .build();
        this.mapper = new ObjectMapper();
    }

    /**
     * Generates a conversational response like ChatGPT using the provided system context.
     */
    public String generateResponse(String userMessage, String systemContext, String language) {
        if (apiKey == null || apiKey.isBlank()) {
            return "DEBUG: System could not locate the API Key. apiKey property evaluated to empty string. (Are you sure you completely stopped and ran a clean 'Build' or 'Rebuild' on your Java project so it copied the new application.properties?)";
        }


        try {
            ObjectNode root = mapper.createObjectNode();
            root.put("model", modelName);
            root.put("temperature", 0.7);

            ArrayNode messages = root.putArray("messages");

            // System Instructions
            String langName = "si".equals(language) ? "Sinhala" : "ta".equals(language) ? "Tamil" : "English";
            ObjectNode systemMsg = mapper.createObjectNode();
            systemMsg.put("role", "system");
            String sysInstruction = "You are 'Infora AI', an advanced AI assistant designed for Sri Lankans.\n"
                + "CRITICAL RULE: You MUST answer the user ENTIRELY in the " + langName + " language. "
                + "NEVER reply in English if the requested language is " + langName + ". "
                + "You will receive English context data below. You MUST mentally translate this data into " + langName + " before answering the user. "
                + "If you fail to speak in " + langName + ", the system will fail.\n\n"
                + "Use the LIVE CONTEXT below to answer them. DO NOT hallucinate news. "
                + "If the context lacks the answer, apologize and converse naturally strictly in " + langName + ".\n\n"
                + "LIVE CONTEXT (Translate this to " + langName + "):\n" + systemContext;
            systemMsg.put("content", sysInstruction);
            messages.add(systemMsg);

            // User Message
            ObjectNode userNode = mapper.createObjectNode();
            userNode.put("role", "user");
            userNode.put("content", userMessage);
            messages.add(userNode);

            String requestBodyStr = mapper.writeValueAsString(root);
            RequestBody body = RequestBody.create(requestBodyStr, MediaType.parse("application/json; charset=utf-8"));

            Request request = new Request.Builder()
                    .url(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonNode respJson = mapper.readTree(response.body().string());
                    return respJson.path("choices").path(0).path("message").path("content").asText();
                } else {
                    String errBody = response.body() != null ? response.body().string() : "Empty";
                    return "DEBUG: OpenAI HTTP Error " + response.code() + " -> " + errBody;
                }
            }

        } catch (Exception e) {
            return "DEBUG: Exception while connecting to OpenAI -> " + e.getMessage();
        }
    }
    
    private String generateOfflineFallback(String userMessage, String context, String language) {
        if (userMessage.toLowerCase().contains("weather") || userMessage.toLowerCase().contains("news")) {
            return "Here are the latest updates I found in our secure database regarding your query. (Note: True conversational AI will activate once the LLM API Key is injected!)";
        }
        return "I am Infora AI! I'm currently running in standard mode because my core AI Brain (API Key) isn't fully linked right now. However, I can still pull live official data for you. Please check the resources attached!";
    }
}
