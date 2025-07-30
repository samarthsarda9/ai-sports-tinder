package com.sports.sportsbackend.dto;

import lombok.Data;

@Data
public class AIResponseDto {

    private Recommendation recommendation;
    private String reasoning;
    private int confidence;
    private String[] keyFactors;
    private RiskLevel risk;


    public enum Recommendation {
        STRONG_BET("Strong Bet"),
        GOOT_BET("Good Bet"),
        RISKY_BET("Risky Bet"),
        AVOID("Avoid");

        private final String value;
        Recommendation(String value) {this.value = value;}
        public String getValue() {
            return value;
        }
    }

    public enum RiskLevel {
        LOW("LOW"),
        MEDIUM("MEDIUM"),
        HIGH("HIGH");

        private final String value;
        RiskLevel(String value) {this.value = value;}
        public String getValue() {
            return value;
        }
    }
}
