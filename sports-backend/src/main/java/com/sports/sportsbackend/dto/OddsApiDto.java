package com.sports.sportsbackend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OddsApiDto {
    private List<Bookmaker> bookmakers;
    private String id;
    private String sport;
    private LocalDateTime commenceTime;
    private String home_team;
    private String away_team;

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
        private int point;
    }
}
