package com.sports.sportsbackend.service;

import com.sports.sportsbackend.dto.ScoreDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ScoresService {

    private static final Logger log = LoggerFactory.getLogger(OddsApiService.class);

    @Value("${ODDS_API_KEY}")
    private String oddsApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public ScoreDto[] getScores(String sport) {
        if (oddsApiKey == null || oddsApiKey.isEmpty()) {
            throw new RuntimeException("Odds API key not set");
        }
        String url = String.format(
                "https://api.the-odds-api.com/v4/sports/%s/scores?apiKey=%s",
                sport, oddsApiKey);
        try {
            ResponseEntity<ScoreDto[]> response = restTemplate.getForEntity(url, ScoreDto[].class);

            String requestsRemaining = response.getHeaders().getFirst("x-requests-remaining");
            String requestsUsed = response.getHeaders().getFirst("x-requests-used");
            log.info("Odds API Requests remaining: {}, Used: {}", requestsRemaining, requestsUsed);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                return new ScoreDto[0];
            }
        } catch (Exception e) {
            log.error("Failed to fetch odds data", e);
            throw new RuntimeException("Failed to fetch scores: " + e.getMessage());
        }
    }
}
