package com.sports.sportsbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class ScoreDto {

    private String id;
    @JsonProperty("sport_key")
    private String sportsKey;
    private boolean completed;
    @JsonProperty("home_team")
    private String homeTeam;
    @JsonProperty("away_team")
    private String awayTeam;
    private List<Score> scores;

    @Data
    public static class Score {
        private String name;
        private String score;
    }

    public boolean isCompleted() {
        return this.completed;
    }

    public int getHomeScore() {
        if (scores == null) return 0;
        return scores.stream()
                .filter(s -> s.getName().equals(this.homeTeam))
                .mapToInt(s -> Integer.parseInt(s.getScore()))
                .findFirst()
                .orElse(0);
    }

    public int getAwayScore() {
        if (scores == null) return 0;
        return scores.stream()
                .filter(s -> s.getName().equals(this.awayTeam))
                .mapToInt(s -> Integer.parseInt(s.getScore()))
                .findFirst()
                .orElse(0);
    }
}
