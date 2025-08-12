package com.sports.sportsbackend.repository;

import com.sports.sportsbackend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, String> {
    List<Game> findByStatus(Game.GameStatus status);

    @Query("SELECT DISTINCT g.sportKey FROM Game g WHERE g.status = 'ONGOING'")
    List<String> findDistinctSportKeyByStatusOngoing();

    List<Game> findBySportKeyAndStatus(String sportKey, Game.GameStatus gameStatus);
}
