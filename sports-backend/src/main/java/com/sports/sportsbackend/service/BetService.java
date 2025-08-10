package com.sports.sportsbackend.service;

import com.sports.sportsbackend.dto.AIResponseDto;
import com.sports.sportsbackend.dto.BetDto;
import com.sports.sportsbackend.dto.BetRequestDto;
import com.sports.sportsbackend.dto.GameDto;
import com.sports.sportsbackend.model.Bet;
import com.sports.sportsbackend.model.Game;
import com.sports.sportsbackend.model.Profile;
import com.sports.sportsbackend.repository.BetRepository;
import com.sports.sportsbackend.repository.GameRepository;
import com.sports.sportsbackend.repository.ProfileRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BetService {

    private final BetRepository betRepository;
    private final ProfileRepository profileRepository;
    private final GameRepository gameRepository;

    public BetService(BetRepository betRepository, ProfileRepository profileRepository,
                      GameRepository gameRepository) {
        this.betRepository = betRepository;
        this.profileRepository = profileRepository;
        this.gameRepository = gameRepository;
    }


    public List<BetDto> getAllBets() {
        return betRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BetDto> getActiveBets() {
        return betRepository.findAllByStatus(Bet.Status.ACTIVE).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<BetDto> getBetById(Long id) {
        Optional<Bet> bet = betRepository.findById(id);
        return bet.map(this::convertToDto);
    }

    public List<BetDto> getBetsByUser(Long userId) {
        return betRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BetDto> getActiveBetsByUser(Long userId) {
        return betRepository.findByUserIdAndStatus(userId, Bet.Status.ACTIVE)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BetDto placeBet(BetRequestDto request, Long userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        if (profile.getWalletBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
        Game game = gameRepository.findById(request.getGameId()).orElseGet(() -> {
            Game newGame = new Game();
            newGame.setId(request.getGameId());
            newGame.setSportKey(request.getSport().name());
            newGame.setHomeTeam(request.getTeam());
            newGame.setAwayTeam(request.getTeam());
            newGame.setStartTime(request.getGameTime());
            newGame.setStatus(Game.GameStatus.UPCOMING);
            return gameRepository.save(newGame);
        });

        if (game.getStatus() != Game.GameStatus.UPCOMING) {
            throw new RuntimeException("Game is not upcoming");
        }

        Bet bet = new Bet();
        bet.setUser(profile.getUser());
        bet.setGame(game);
        bet.setPlayer(request.getPlayer());
        bet.setTeam(request.getTeam());
        bet.setOpponent(request.getOpponent());
        bet.setSport(request.getSport());
        bet.setType(request.getType());
        bet.setAmount(request.getAmount());
        bet.setStatus(Bet.Status.ACTIVE);
        bet.setLine(request.getLine());
        bet.setOverUnder(request.getOverUnder());
        bet.setGameTime(request.getGameTime());
        bet.setDescription(request.getDescription());
        bet.setOdds(request.getOdds());

        Bet savedBet = betRepository.save(bet);

        profile.setWalletBalance(profile.getWalletBalance().subtract(request.getAmount()));
        profileRepository.save(profile);
        return convertToDto(savedBet);
    }

//    @Transactional
//    public BetDto updateBetStatus(Long id, Bet.BetStatus status) {
//        Bet bet = betRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Bet not found"));
//        bet.setStatus(status);
//        Bet updatedBet = betRepository.save(bet);
//
//        if (status == Bet.BetStatus.WON) {
//            Profile profile = profileRepository.findByUserId(bet.getUser().getId())
//                    .orElseThrow(() -> new RuntimeException("Profile not found"));
//            profile.setWalletBalance(profile.getWalletBalance().add(updatedBet.getPotentialWinnings()));
//            profileRepository.save(profile);
//        }
//        return convertToDto(updatedBet);
//    }

    private BetDto convertToDto(Bet bet) {
        GameDto gameDto = new GameDto(
                bet.getGame().getId(),
                bet.getGame().getHomeTeam(),
                bet.getGame().getAwayTeam(),
                bet.getGame().getStartTime(),
                bet.getGame().getStatus(),
                bet.getGame().getHomeScore(),
                bet.getGame().getAwayScore(),
                bet.getGame().getWinner(),
                bet.getGame().getCreatedAt(),
                bet.getGame().getUpdatedAt()
        );

        AIResponseDto analysis = null;
        if (bet.getDescription() != null || bet.getConfidence() > 0) {
            analysis = new AIResponseDto();
            analysis.setReasoning(bet.getDescription());
            analysis.setConfidence(bet.getConfidence());
            analysis.setRecommendation(AIResponseDto.Recommendation.GOOD_BET);
            analysis.setKeyFactors(new String[]{});
            analysis.setRiskLevel(AIResponseDto.RiskLevel.MEDIUM);
        }
        return new BetDto(
                bet.getId(),
                gameDto,
                bet.getPlayer(),
                bet.getTeam(),
                bet.getOpponent(),
                bet.getSport(),
                bet.getType(),
                bet.getOverUnder(),
                bet.getLine(),
                bet.getOdds(),
                bet.getAmount(),
                bet.getGameTime(),
                bet.getStatus(),
                bet.getDescription(),
                bet.getCreatedAt(),
                bet.getUpdatedAt(),
                analysis
        );
    }
}
