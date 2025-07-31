package com.sports.sportsbackend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "bets")
public class Bet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String player;

    @Column(nullable = false)
    private String team;

    private String opponent;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Bet.Sport sport;

    @Column(name = "bet_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private Bet.BetType type;

    @Column(nullable = false)
    private BigDecimal line;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Bet.OverUnder overUnder;

    @Column(nullable = false)
    private BigDecimal odds;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    private LocalDateTime gameTime;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(nullable = false)
    private int confidence;

    @Column(length = 512)
    private String description;

    public enum Sport {
        NBA, NFL, MLB, NHL, NCAAB, EPL, MLS, NCAAF, OTHER
    }

    public enum BetType {
        POINTS, REBOUNDS, ASSISTS, PASSING, RUSHING, RECEIVING,
            HITS, STRIKES, GOALS, SAVES, SPREAD, TOTAL_POINTS, H2H
    }

    public enum OverUnder {
        OVER, UNDER
    }

    public enum Status {
        ACTIVE, WON, LOST
    }

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
