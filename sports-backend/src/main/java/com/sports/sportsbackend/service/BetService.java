package com.sports.sportsbackend.service;

import com.sports.sportsbackend.dto.BetDto;
import com.sports.sportsbackend.dto.GameDto;
import com.sports.sportsbackend.model.Bet;
import com.sports.sportsbackend.model.Game;
import com.sports.sportsbackend.model.Profile;
import com.sports.sportsbackend.model.User;
import com.sports.sportsbackend.repository.BetRepository;
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
    private final GameService gameService;
    private final UserService userService;

    public BetService(BetRepository betRepository, ProfileRepository profileRepository,
                      GameService gameService, UserService userService) {
        this.betRepository = betRepository;
        this.profileRepository = profileRepository;
        this.gameService = gameService;
        this.userService = userService;
    }


    public List<BetDto> getAllBets() {
        return betRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BetDto> getActiveBets() {
        return betRepository.findAllByStatus(Bet.BetStatus.ACTIVE).stream()
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
        return betRepository.findByUserIdAndStatus(userId, Bet.BetStatus.ACTIVE)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BetDto placeBet(Long gameId, BigDecimal betAmount, Bet.Winner winner, Long userId) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        if (profile.getWalletBalance().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Wallet balance is negative");
        }
        Game game = gameService.getGameEntityById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        if (game.getStatus() != Game.GameStatus.UPCOMING) {
            throw new RuntimeException("Game is not upcoming");
        }
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Bet bet = new Bet();
        bet.setUser(user);
        bet.setGame(game);
        bet.setAmount(betAmount);
        bet.setStatus(Bet.BetStatus.ACTIVE);
        bet.setWinner(winner);

        Bet savedBet = betRepository.save(bet);

        profile.setWalletBalance(profile.getWalletBalance().subtract(bet.getAmount()));
        profileRepository.save(profile);
        return convertToDto(savedBet);
    }

    @Transactional
    public BetDto updateBetStatus(Long id, Bet.BetStatus status) {
        Bet bet = betRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bet not found"));
        bet.setStatus(status);
        Bet updatedBet = betRepository.save(bet);

        if (status == Bet.BetStatus.WON) {
            Profile profile = profileRepository.findByUserId(bet.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("Profile not found"));
            profile.setWalletBalance(profile.getWalletBalance().add(updatedBet.getPotentialWinnings()));
            profileRepository.save(profile);
        }
        return convertToDto(updatedBet);
    }

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
        return new BetDto(
                bet.getId(),
                gameDto,
                bet.getAmount(),
                bet.getWinner(),
                bet.getStatus(),
                bet.getPotentialWinnings(),
                bet.getCreatedAt(),
                bet.getUpdatedAt()
        );
    }



}
