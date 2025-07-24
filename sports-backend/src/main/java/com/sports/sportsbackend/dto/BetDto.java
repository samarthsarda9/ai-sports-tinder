package com.sports.sportsbackend.dto;

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
    private BigDecimal amount;
    private Bet.Winner winner;
    private Bet.BetStatus status;
    private BigDecimal potentialWinnings;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
