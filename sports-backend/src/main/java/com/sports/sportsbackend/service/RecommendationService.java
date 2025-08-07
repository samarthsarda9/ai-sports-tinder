package com.sports.sportsbackend.service;

import com.fasterxml.jackson.core.type.TypeReference;
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

@Service
public class RecommendationService {

    private final WebClient webClient;
    private final OddsApiService oddsApiService;

    @Value("${geminiapi.model-path}")
    private String geminiApiModel;

    @Value("${geminiapi.key}")
    private String geminiApiKey;

    public RecommendationService(WebClient.Builder webClientBuilder,
                                 OddsApiService oddsApiService,
                                 @Value("${geminiapi.base-url}") String geminiApiUrl) {
        this.webClient = webClientBuilder.baseUrl(geminiApiUrl).build();
        this.oddsApiService = oddsApiService;
    }

    public List<BetDto> getRecommendations(String sport) {
        OddsApiDto[] oddsData = oddsApiService.getOdds(sport, "us", "spreads,totals,h2h");
        List<BetRequestDto> allPotentialBets = new ArrayList<>();
        for (OddsApiDto game : oddsData) {
            allPotentialBets.addAll(createBetRequestFromData(game));
        }
        if (allPotentialBets.isEmpty()) {
            return new ArrayList<>();
        }
        List<AIResponseDto> allAnalyses = getBatchRecommendations(allPotentialBets);
        return combineBetsWithAnalyses(allPotentialBets, allAnalyses);
    }

    public List<AIResponseDto> getBatchRecommendations(List<BetRequestDto> requests) {
        String prompt = buildBatchPrompt(requests);
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[] {
                                Map.of("text", prompt)
                        })
                }
        );


        String response = this.webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path(geminiApiModel)
                        .queryParam("key", geminiApiKey)
                        .build())
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JSONObject root = new JSONObject(response);
            String textResponse = root.getJSONArray("candidates")
                    .getJSONObject(0)
                    .getJSONObject("content")
                    .getJSONArray("parts")
                    .getJSONObject(0)
                    .getString("text");
            String cleanJson = textResponse.replace("```json", "").replace("```", "").trim();
            return objectMapper.readValue(cleanJson, new TypeReference<List<AIResponseDto>>() {});
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to parse AI response: " + e.getMessage());
        }
    }

    private List<BetDto> combineBetsWithAnalyses(List<BetRequestDto> potentialBets, List<AIResponseDto> allAnalyses) {
        List<BetDto> allBets = new ArrayList<>();

        int minBets = Math.min(potentialBets.size(), allAnalyses.size());

        for (int i = 0; i < minBets; i++) {
            BetRequestDto request = potentialBets.get(i);
            AIResponseDto analysis = allAnalyses.get(i);

            BetDto bet = new BetDto();
            bet.setPlayer(request.getPlayer());
            bet.setTeam(request.getTeam());
            bet.setOpponent(request.getOpponent());
            bet.setSport(request.getSport());
            bet.setType(request.getType());
            bet.setLine(request.getLine());
            bet.setOdds(request.getOdds());
            bet.setOverUnder(request.getOverUnder());
            bet.setGameTime(request.getGameTime());
            bet.setDescription(analysis.getReasoning());

            bet.setAiResponse(analysis);

            GameDto gameDto = new GameDto();
            gameDto.setId(request.getGameId());
            gameDto.setHomeTeam(request.getTeam());
            gameDto.setAwayTeam(request.getOpponent());
            bet.setGame(gameDto);
            allBets.add(bet);
        }
        return allBets;
    }

    private List<BetRequestDto> createBetRequestFromData(OddsApiDto game) {
        List<BetRequestDto> requests = new ArrayList<>();
        if (game.getBookmakers() == null || game.getBookmakers().isEmpty()) {
            return requests;
        }

        OddsApiDto.Bookmaker bookmaker = game.getBookmakers().get(0);

        // --- Process H2H Market ---
        bookmaker.getMarkets().stream()
                .filter(m -> "h2h".equals(m.getKey()))
                .findFirst()
                .ifPresent(market -> {
                    for (OddsApiDto.Outcome outcome : market.getOutcomes()) {
                        if (outcome.getName() != null) {
                            BetRequestDto h2hBet = new BetRequestDto();
                            h2hBet.setGameId(game.getId());
                            h2hBet.setPlayer(outcome.getName());
                            h2hBet.setTeam(outcome.getName());
                            h2hBet.setOpponent(outcome.getName().equals(game.getHomeTeam()) ?
                                    game.getAwayTeam() : game.getHomeTeam());
                            h2hBet.setSport(mapSportKeyToEnum(game.getSportKey())); 
                            h2hBet.setType(Bet.BetType.H2H);
                            h2hBet.setLine(BigDecimal.ZERO);
                            h2hBet.setOdds(BigDecimal.valueOf(outcome.getPrice()));
                            h2hBet.setGameTime(game.getCommenceTime()); // Use correct getter
                            h2hBet.setDescription(String.format("%s Moneyline", outcome.getName()));
                            requests.add(h2hBet);
                        }
                    }
                });

        // --- Process Spreads Market ---
        bookmaker.getMarkets().stream()
                .filter(m -> "spreads".equals(m.getKey()))
                .findFirst()
                .ifPresent(market -> {
                    for (OddsApiDto.Outcome outcome : market.getOutcomes()) {
                        if (outcome.getName() != null && outcome.getPoint() != 0) {
                            BetRequestDto spreadBet = new BetRequestDto();
                            spreadBet.setGameId(game.getId());
                            spreadBet.setPlayer(outcome.getName());
                            spreadBet.setTeam(outcome.getName());
                            spreadBet.setOpponent(outcome.getName().equals(game.getHomeTeam()) ?
                                    game.getAwayTeam() : game.getHomeTeam());
                            spreadBet.setSport(mapSportKeyToEnum(game.getSportKey())); 
                            spreadBet.setType(Bet.BetType.SPREAD);
                            spreadBet.setLine(BigDecimal.valueOf(outcome.getPoint()));
                            spreadBet.setOdds(BigDecimal.valueOf(outcome.getPrice()));
                            spreadBet.setOverUnder(outcome.getPoint() >= 0 ? Bet.OverUnder.OVER : Bet.OverUnder.UNDER);
                            spreadBet.setGameTime(game.getCommenceTime()); 
                            spreadBet.setDescription(String.format("%s %+f", outcome.getName(), outcome.getPoint()));
                            requests.add(spreadBet);
                        }
                    }
                });

        // --- Process Totals (Over/Under) Market ---
        bookmaker.getMarkets().stream()
                .filter(m -> "totals".equals(m.getKey()))
                .findFirst()
                .ifPresent(market -> {
                    for (OddsApiDto.Outcome outcome : market.getOutcomes()) {
                        if (outcome.getName() != null && outcome.getPoint() != 0) {
                            BetRequestDto totalBet = new BetRequestDto();
                            totalBet.setGameId(game.getId());
                            totalBet.setPlayer("Total Score");
                            totalBet.setTeam(game.getHomeTeam());
                            totalBet.setOpponent(game.getAwayTeam());
                            totalBet.setSport(mapSportKeyToEnum(game.getSportKey())); 
                            totalBet.setType(Bet.BetType.TOTAL_POINTS);
                            totalBet.setLine(BigDecimal.valueOf(outcome.getPoint()));
                            totalBet.setOdds(BigDecimal.valueOf(outcome.getPrice()));
                            totalBet.setOverUnder("Over".equalsIgnoreCase(outcome.getName()) ? Bet.OverUnder.OVER : Bet.OverUnder.UNDER);
                            totalBet.setGameTime(game.getCommenceTime()); 
                            totalBet.setDescription(String.format("Total Points %s %f", outcome.getName(), outcome.getPoint()));
                            requests.add(totalBet);
                        }
                    }
                });
        return requests;
    }

    private Bet.Sport mapSportKeyToEnum(String sportKey) {
        if (sportKey == null) return Bet.Sport.OTHER;
        return switch (sportKey) {
            case "americanfootball_nfl" -> Bet.Sport.NFL;
            case "basketball_nba" -> Bet.Sport.NBA;
            case "basketball_ncaab" -> Bet.Sport.NCAAB;
            case "baseball_mlb" -> Bet.Sport.MLB;
            case "icehockey_nhl" -> Bet.Sport.NHL;
            case "soccer_epl" -> Bet.Sport.EPL;
            case "soccer_use_mls" -> Bet.Sport.MLS;
            default -> Bet.Sport.OTHER;
        };
    }


    private String buildBatchPrompt(List<BetRequestDto> requests) {
        StringBuilder betsJson = new StringBuilder("[");
        for (int i = 0; i < requests.size(); i++) {
            BetRequestDto request = requests.get(i);
            betsJson.append(String.format(
                    "{\"id\": %d, \"player\": \"%s\", \"betType\": \"%s\", \"line\": %s, \"overUnder\": \"%s\"}",
                    i, request.getPlayer(), request.getType(), request.getLine(), request.getOverUnder()
            ));
            if (i < requests.size() - 1) {
                betsJson.append(",");
            }
        }
        betsJson.append("]");

        return String.format(
                "Act as an expert sports betting analyst. Analyze the following list of bets and return a JSON array where each object corresponds to a bet in the input list. " +
                        "Analyze each bet as its own bet without reference to previous bets." +
                        "Input Bets:%n%s%n%n" +
                        "Response Format:%n" +
                        "Respond ONLY with a raw JSON object. Do not include any introductory text, explanations, or markdown formatting like ```json. The JSON object must conform to the following structure:%n" +
                        "{\"recommendation\": \"<'Strong Bet', 'Good Bet', 'Risky Bet', or 'Avoid'>\", \"reasoning\": \"<A concise, data-driven paragraph explaining your recommendation.>\", " +
                        "\"confidence\": <A number between 0 and 100 representing your confidence in this bet.>, \"keyFactors\": [\"<A key factor supporting your analysis>\", " +
                        "\"<Another key factor>\"], \"riskLevel\": \"<'Low', 'Medium', or 'High'>\"}",
                betsJson.toString()
        );
    }
}
