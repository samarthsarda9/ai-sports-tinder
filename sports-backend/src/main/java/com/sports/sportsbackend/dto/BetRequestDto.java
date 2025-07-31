package com.sports.sportsbackend.dto;

import com.sports.sportsbackend.model.Bet;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BetRequestDto {
    private String player;
    private String team;
    private String opponent;
    private Bet.Sport sport;
    private Bet.BetType type;
    private BigDecimal line;
    private Bet.OverUnder overUnder;
    private BigDecimal odds;
    private LocalDateTime gameTime;
    private String description;
    private int confidence;

    private BigDecimal amount;

    private Long gameId;
}
