package com.sports.sportsbackend.service;

import com.sports.sportsbackend.dto.GameDto;
import com.sports.sportsbackend.model.Game;
import com.sports.sportsbackend.repository.GameRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GameService {

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {this.gameRepository = gameRepository;}

    public List<GameDto> getAllGames(Game.GameStatus status) {
        return gameRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<GameDto> getAllGames() {
        return gameRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<GameDto> getGameById(String id) {
        Optional<Game> game = gameRepository.findById(id);
        return game.map(this::convertToDto);
    }

    public Optional<Game> getGameEntityById(String id) {
        return gameRepository.findById(id);
    }

    @Transactional
    public GameDto createGame(Game game) {
        Game savedGame = gameRepository.save(game);
        return convertToDto(savedGame);
    }

    public GameDto updateGame(String id, Game game) {
        Game gameToUpdate = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("game not found"));
        gameToUpdate.setHomeTeam(game.getHomeTeam());
        gameToUpdate.setAwayTeam(game.getAwayTeam());
        gameToUpdate.setStartTime(game.getStartTime());
        gameToUpdate.setStatus(game.getStatus());
        gameToUpdate.setHomeScore(game.getHomeScore());
        gameToUpdate.setAwayScore(game.getAwayScore());
        gameToUpdate.setWinner(game.getWinner());
        return convertToDto(gameRepository.save(gameToUpdate));
    }

    public void deleteGame(String id) {
        gameRepository.deleteById(id);
    }

    private GameDto convertToDto(Game game) {
        return new GameDto(
                game.getId(),
                game.getHomeTeam(),
                game.getAwayTeam(),
                game.getStartTime(),
                game.getStatus(),
                game.getHomeScore(),
                game.getAwayScore(),
                game.getWinner(),
                game.getCreatedAt(),
                game.getUpdatedAt()
        );
    }
}
