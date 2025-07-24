package com.sports.sportsbackend.controller;

import com.sports.sportsbackend.dto.GameDto;
import com.sports.sportsbackend.model.Game;
import com.sports.sportsbackend.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/games")
@CrossOrigin
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {this.gameService = gameService;}

    @GetMapping
    public ResponseEntity<List<GameDto>> getAllGames(@RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            Game.GameStatus gameStatus = Game.GameStatus.valueOf(status);
            return ResponseEntity.ok(gameService.getAllGames(gameStatus));
        }
        return ResponseEntity.ok(gameService.getAllGames());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameDto> getGameById(@PathVariable("id") Long id) {
        Optional<GameDto> game = gameService.getGameById(id);
        return game.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<GameDto> createGame(@RequestBody Game game) {
        GameDto createdGame = gameService.createGame(game);
        return ResponseEntity.ok(createdGame);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GameDto> updateGame(@PathVariable("id") Long id, @RequestBody Game game) {
        GameDto updatedGame = gameService.updateGame(id, game);
        return ResponseEntity.ok(updatedGame);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GameDto> deleteGame(@PathVariable("id") Long id) {
        gameService.deleteGame(id);
        return ResponseEntity.noContent().build();
    }
}
