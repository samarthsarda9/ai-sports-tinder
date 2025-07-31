package com.sports.sportsbackend.dto;

import com.sports.sportsbackend.model.Game;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameDto {
    private String id;
    private String homeTeam;
    private String awayTeam;
    private LocalDateTime startTime;
    private Game.GameStatus status;
    private Integer homeScore;
    private Integer awayScore;
    private String winner;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
