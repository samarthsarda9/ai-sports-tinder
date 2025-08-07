package com.sports.sportsbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sports.sportsbackend.model.Bet;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BetDto {
    private Long id;
    private GameDto game;
    private String player;
    private String team;
    private String opponent;
    private Bet.Sport sport;
    private Bet.BetType type;
    private Bet.OverUnder overUnder;
    private BigDecimal line;
    private BigDecimal odds;
    private BigDecimal amount;
    private LocalDateTime gameTime;
    private Bet.Status status;
    private int confidence;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @JsonProperty("aiAnalysis")
    private AIResponseDto aiResponse;
}
