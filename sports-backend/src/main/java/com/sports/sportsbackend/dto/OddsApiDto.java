package com.sports.sportsbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OddsApiDto {
    private String id;
    @JsonProperty("sport_key")
    private String sportKey;
    @JsonProperty("home_team")
    private String homeTeam;
    @JsonProperty("away_team")
    private String awayTeam;
    @JsonProperty("commence_time")
    private LocalDateTime commenceTime;
    private List<Bookmaker> bookmakers;

    @Data
    public static class Bookmaker {
        private String key;
        private String title;
        private List<Market> markets;
    }

    @Data
    public static class Market {
        private String key;
        private List<Outcome> outcomes;
    }

    @Data
    public static class Outcome {
        private String name;
        private Long price;
        private float point;
    }
}
