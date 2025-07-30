package com.sports.sportsbackend.service;

import com.sports.sportsbackend.dto.AIResponseDto;
import com.sports.sportsbackend.dto.BetRequestDto;
import org.json.JSONObject;
import org.json.JSONArray;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
public class RecommendationService {

    private final WebClient webClient;

    @Value("${geminiapi.url}")
    private String geminiApiUrl;

    @Value("${geminiapi.key}")
    private String geminiApiKey;

    public RecommendationService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public AIResponseDto getRecommendation(BetRequestDto request) {
        String prompt = buildPrompt(request);
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[] {
                                Map.of("text", prompt)
                        })
                }
        );
        String response = webClient.post()
                .uri(geminiApiUrl + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Extract response and return
        return extractResponseContent(response);
    }

    private AIResponseDto extractResponseContent(String response) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JSONObject root = new JSONObject(response);
            String textResponse = root.getJSONArray("candidates")
                    .getJSONObject(0)
                    .getJSONObject("content")
                    .getJSONArray("parts")
                    .getJSONObject(0)
                    .getString("text");
            AIResponseDto responseDto = objectMapper.readValue(textResponse, AIResponseDto.class);
            return responseDto;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to parse AI response: " + e.getMessage());
        }
    }

    private String buildPrompt(BetRequestDto request) {
        String prompt = String.format(
                "Act as an expert sports betting analyst. Your task is to analyze the following player prop bet and provide a detailed, data-driven recommendation.%n%n" +
                        "**Bet Details:**%n" +
                        "- **Sport:** %s%n" +
                        "- **Player:** %s%n" +
                        "- **Team:** %s%n" +
                        "- **Opponent:** %s%n" +
                        "- **Game Time:** %s%n" +
                        "- **Bet Type:** %s on the player's %s%n" +
                        "- **Line:** %s %s%n" +
                        "- **Odds:** %s%n%n" +
                        "**Your Analysis Must Consider:**%n" +
                        "- The player's recent performance and consistency.%n" +
                        "- The matchup favorability against the opposing team's defense.%n" +
                        "- The implied probability based on the provided odds.%n" +
                        "- Any potential situational factors (e.g., rivalry game, travel).%n%n" +
                        "**Response Format:**%n" +
                        "Respond ONLY with a raw JSON object. Do not include any introductory text, explanations, or markdown formatting like ```json. The JSON object must conform to the following structure:%n" +
                        "{\"recommendation\": \"<'Strong Bet', 'Good Bet', 'Risky Bet', or 'Avoid'>\", \"reasoning\": \"<A concise, data-driven paragraph explaining your recommendation.>\", " +
                        "\"confidence\": <A number between 0 and 100 representing your confidence in this bet.>, \"keyFactors\": [\"<A key factor supporting your analysis>\", " +
                        "\"<Another key factor>\"], \"riskLevel\": \"<'Low', 'Medium', or 'High'>\"}",
                request.getSport(),
                request.getPlayer(),
                request.getTeam(),
                request.getOpponent(),
                request.getGameTime().toString(),
                request.getType(),
                request.getDescription(),
                request.getOverUnder(),
                request.getLine(),
                request.getOdds()
        );
        return prompt;

    }
}
