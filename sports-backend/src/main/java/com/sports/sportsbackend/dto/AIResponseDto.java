package com.sports.sportsbackend.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Data;

@Data
public class AIResponseDto {

    private Recommendation recommendation;
    private String reasoning;
    private int confidence;
    private String[] keyFactors;
    private RiskLevel riskLevel;

    public enum Recommendation {
        STRONG_BET("Strong Bet"),
        GOOD_BET("Good Bet"),
        RISKY_BET("Risky Bet"),
        AVOID("Avoid");

        private final String value;

        Recommendation(String value) {
            this.value = value;
        }

        @JsonValue // This tells Jackson to use this value for serialization
        public String getValue() {
            return value;
        }

        @JsonCreator // This tells Jackson to use this method for deserialization
        public static Recommendation fromValue(String value) {
            for (Recommendation rec : values()) {
                if (rec.value.equalsIgnoreCase(value)) {
                    return rec;
                }
            }
            throw new IllegalArgumentException("Unknown recommendation value: " + value);
        }
    }

    public enum RiskLevel {
        LOW("Low"),
        MEDIUM("Medium"),
        HIGH("High");

        private final String value;

        RiskLevel(String value) {
            this.value = value;
        }

        @JsonValue
        public String getValue() {
            return value;
        }

        @JsonCreator
        public static RiskLevel fromValue(String value) {
            for (RiskLevel level : values()) {
                if (level.value.equalsIgnoreCase(value)) {
                    return level;
                }
            }
            throw new IllegalArgumentException("Unknown risk level value: " + value);
        }
    }
}