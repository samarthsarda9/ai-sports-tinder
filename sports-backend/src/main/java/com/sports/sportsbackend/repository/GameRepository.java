package com.sports.sportsbackend.repository;

import com.sports.sportsbackend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByStatus(Game.GameStatus status);
}
