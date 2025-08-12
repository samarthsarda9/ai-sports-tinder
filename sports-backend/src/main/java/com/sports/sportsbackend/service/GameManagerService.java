package com.sports.sportsbackend.service;

import com.sports.sportsbackend.dto.ScoreDto;
import com.sports.sportsbackend.model.Bet;
import com.sports.sportsbackend.model.Game;
import com.sports.sportsbackend.model.Profile;
import com.sports.sportsbackend.repository.BetRepository;
import com.sports.sportsbackend.repository.GameRepository;
import com.sports.sportsbackend.repository.ProfileRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GameManagerService {

    private final GameRepository gameRepository;
    private final ProfileRepository profileRepository;
    private final BetRepository betRepository;
    private final ScoresService scoresService;

    public GameManagerService(GameRepository gameRepository, ProfileRepository profileRepository,
                              BetRepository betRepository, ScoresService scoresService) {
        this.gameRepository = gameRepository;
        this.profileRepository = profileRepository;
        this.betRepository = betRepository;
        this.scoresService = scoresService;
    }

    @Scheduled(fixedRate = 900000)
    @Transactional
    public void updateGamesAndHandleBets() {
        List<String> activeSports = gameRepository.findDistinctSportKeyByStatusOngoing();
        if (activeSports.isEmpty()) {
            System.out.println("No ongoing games found");
            return;
        }

        for (String sportKey : activeSports) {
            List<Game> activeGames = gameRepository.findBySportKeyAndStatus(sportKey, Game.GameStatus.ONGOING);
            if (activeGames.isEmpty()) {continue;}

            ScoreDto[] liveScores = scoresService.getScores(sportKey);
            Map<String, ScoreDto> scoreMap = Arrays.stream(liveScores)
                    .collect(Collectors.toMap(ScoreDto::getId, scoreDto -> scoreDto));

            for (Game game : activeGames) {
                ScoreDto latestScore = scoreMap.get(game.getId());
                if (latestScore != null) {
                    game.setHomeScore(latestScore.getHomeScore());
                    game.setAwayScore(latestScore.getAwayScore());

                    if (latestScore.isCompleted()) {
                        game.setStatus(Game.GameStatus.FINISHED);
                        if (latestScore.getHomeScore() > latestScore.getAwayScore()) {
                            game.setWinner(game.getHomeTeam());
                        } else {
                            game.setWinner(game.getAwayTeam());
                        }
                        settleBetsForWin(game);
                    }
                    gameRepository.save(game);
                }
            }
        }
    }

    private void settleBetsForWin(Game game) {
        List<Bet> activeBets = betRepository.findByGameIdAndStatus(game.getId(), Bet.Status.ACTIVE);
        for (Bet bet : activeBets) {
            boolean won = determineBetOutcome(bet, game);
            if (won) {
                bet.setStatus(Bet.Status.WON);
                updateWallet(bet);
            } else {
                bet.setStatus(Bet.Status.LOST);
            }
            betRepository.save(bet);
        }
    }

    private boolean determineBetOutcome(Bet bet, Game game) {
        switch (bet.getType()) {
            case H2H:
                String winner = game.getHomeScore() > game.getAwayScore() ? game.getHomeTeam() : game.getAwayTeam();
                return bet.getTeam().equals(winner);
            case TOTAL_POINTS:
                int total = game.getHomeScore() + game.getAwayScore();
                double line = bet.getLine().doubleValue();

                if (bet.getOverUnder() == Bet.OverUnder.OVER) {
                    return total > line;
                } else {
                    return total < line;
                }
            case SPREAD:
                double pointSpread = bet.getLine().doubleValue();

                if (bet.getTeam().equals(game.getHomeTeam())) {
                    return (game.getHomeScore() + pointSpread) > game.getAwayScore();
                } else {
                    return (game.getAwayScore() + pointSpread) > game.getHomeScore();
                }
            default: return false;
        }
    }

    private void updateWallet(Bet bet) {
        Profile profile = profileRepository.findByUserId(bet.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        BigDecimal odds = bet.getOdds();
        BigDecimal amount = bet.getAmount();
        BigDecimal winnings;

        if (odds.compareTo(BigDecimal.ZERO) > 0) {
            winnings = amount.multiply(odds.divide(new BigDecimal(100)));
        } else {
            winnings = amount.multiply(new BigDecimal(100).divide(odds.abs()));
        }

        profile.setWalletBalance(profile.getWalletBalance().add(winnings).add(amount));
        profileRepository.save(profile);
    }
}
