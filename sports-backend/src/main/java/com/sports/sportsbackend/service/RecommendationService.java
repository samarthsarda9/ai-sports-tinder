package com.sports.sportsbackend.service;

import com.sports.sportsbackend.dto.*;
import com.sports.sportsbackend.model.Bet;
import org.json.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RecommendationService {

    private final WebClient webClient;
    private final OddsApiService oddsApiService;

    @Value("${geminiapi.url}")
    private String geminiApiUrl;

    @Value("${geminiapi.key}")
    private String geminiApiKey;

    public RecommendationService(WebClient.Builder webClientBuilder, OddsApiService oddsApiService) {
        this.webClient = webClientBuilder.build();
        this.oddsApiService = oddsApiService;
    }

    public List<BetDto> getRecommendations(String sport) {
        OddsApiDto[] oddsData = oddsApiService.getOdds(sport, "us", "spreads,totals,h2h");
        List<BetDto> recommendations = new ArrayList<>();
        for (OddsApiDto game : oddsData) {
            List<BetRequestDto> potentialBets = createBetRequestFromData(game);
            for (BetRequestDto potentialBet : potentialBets) {
                AIResponseDto analysis = getRecommendation(potentialBet);
                recommendations.add(createBetDto(potentialBet, analysis, game));
            }
        }
        return recommendations;
    }

    private List<BetRequestDto> createBetRequestFromData(OddsApiDto game) {
        List<BetRequestDto> requests = new ArrayList<>();
        if (game.getBookmakers() == null || game.getBookmakers().isEmpty()) {
            return requests;
        }

        OddsApiDto.Bookmaker bookmaker = game.getBookmakers().get(0);

        Optional<OddsApiDto.Market> market = bookmaker.getMarkets().stream()
                .filter(m -> "spreads".equals(m.getKey()))
                .findFirst();

        if (market.isPresent()) {
            OddsApiDto.Market marketData = market.get();
            for (OddsApiDto.Outcome outcome : marketData.getOutcomes()) {
                BetRequestDto spreadBet = new BetRequestDto();
                spreadBet.setGameId(game.getId());
                spreadBet.setPlayer(outcome.getName());
                spreadBet.setTeam(outcome.getName());
                spreadBet.setOpponent(outcome.getName().equals(game.getHome_team()) ? game.getAway_team() : game.getHome_team());
                spreadBet.setSport(Bet.Sport.valueOf(game.getSport()));
                spreadBet.setType(Bet.BetType.SPREAD);
                spreadBet.setLine(BigDecimal.valueOf(outcome.getPoint()));
                spreadBet.setOdds(BigDecimal.valueOf(outcome.getPrice()));
                spreadBet.setOverUnder(outcome.getPoint() >= 0 ? Bet.OverUnder.OVER : Bet.OverUnder.UNDER);
                spreadBet.setGameTime(game.getCommenceTime());
                spreadBet.setDescription(String.format("%s %s", outcome.getName(), outcome.getPoint()));
                requests.add(spreadBet);
            }
        }

        Optional<OddsApiDto.Market> totalsMarketOpt = bookmaker.getMarkets().stream()
                .filter(m -> "totals".equals(m.getKey()))
                .findFirst();

        if (totalsMarketOpt.isPresent()) {
            OddsApiDto.Market totalsMarket = totalsMarketOpt.get();
            for (OddsApiDto.Outcome outcome : totalsMarket.getOutcomes()) {
                BetRequestDto totalBet = new BetRequestDto();
                totalBet.setGameId(game.getId());
                totalBet.setPlayer("Total Score"); // Player is conceptual here
                totalBet.setTeam(game.getHome_team());
                totalBet.setOpponent(game.getAway_team());
                totalBet.setSport(Bet.Sport.valueOf(game.getSport()));
                totalBet.setType(Bet.BetType.TOTAL_POINTS);
                totalBet.setLine(BigDecimal.valueOf(outcome.getPoint()));
                totalBet.setOdds(BigDecimal.valueOf(outcome.getPrice()));
                totalBet.setOverUnder("Over".equalsIgnoreCase(outcome.getName()) ? Bet.OverUnder.OVER : Bet.OverUnder.UNDER);
                totalBet.setGameTime(game.getCommenceTime());
                totalBet.setDescription(String.format("Total Points %s %s", outcome.getName(), outcome.getPoint()));
                requests.add(totalBet);
            }
        }

        Optional<OddsApiDto.Market> h2hMarketOpt = bookmaker.getMarkets().stream()
                .filter(m -> "h2h".equals(m.getKey()))
                .findFirst();

        if (h2hMarketOpt.isPresent()) {
            for (OddsApiDto.Outcome outcome : h2hMarketOpt.get().getOutcomes()) {
                BetRequestDto h2hBet = new BetRequestDto();
                h2hBet.setGameId(game.getId());
                h2hBet.setPlayer(outcome.getName()); // For team bets, the player is the team
                h2hBet.setTeam(outcome.getName());
                h2hBet.setOpponent(outcome.getName().equals(game.getHome_team()) ? game.getAway_team() : game.getHome_team());
                h2hBet.setSport(Bet.Sport.valueOf(game.getSport()));
                h2hBet.setType(Bet.BetType.H2H);
                h2hBet.setLine(BigDecimal.ZERO); // H2H bets have no line
                h2hBet.setOdds(BigDecimal.valueOf(outcome.getPrice()));
                h2hBet.setGameTime(game.getCommenceTime());
                h2hBet.setDescription(String.format("%s Moneyline", outcome.getName()));
                requests.add(h2hBet);
            }
        }
        return requests;
    }

    private BetDto createBetDto(BetRequestDto request, AIResponseDto analysis, OddsApiDto game) {
        BetDto bet = new BetDto();
        bet.setPlayer(request.getPlayer());
        bet.setTeam(request.getTeam());
        bet.setOpponent(request.getOpponent());
        bet.setSport(request.getSport());
        bet.setType(request.getType());
        bet.setLine(request.getLine());
        bet.setOdds(request.getOdds());
        bet.setOverUnder(request.getOverUnder());
        bet.setGameTime(game.getCommenceTime());

        bet.setDescription(analysis.getReasoning());
        bet.setConfidence(analysis.getConfidence());

        GameDto gameDto = new GameDto();
        gameDto.setId(game.getId());
        gameDto.setHomeTeam(game.getHome_team());
        gameDto.setAwayTeam(game.getAway_team());
        bet.setGame(gameDto);
        return bet;
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
