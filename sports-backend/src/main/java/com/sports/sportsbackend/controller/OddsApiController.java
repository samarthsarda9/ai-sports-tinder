package com.sports.sportsbackend.controller;

import com.sports.sportsbackend.dto.OddsApiDto;
import com.sports.sportsbackend.service.OddsApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/odds")
@CrossOrigin
public class OddsApiController {

    private final OddsApiService oddsApiService;

    public OddsApiController(OddsApiService oddsApiService) {
        this.oddsApiService = oddsApiService;
    }

    @GetMapping
    public ResponseEntity<?> getOdds(
            @RequestParam String sport,
            @RequestParam(defaultValue = "us") String region,
            @RequestParam(defaultValue = "h2h") String market
    ) {
        try {
            OddsApiDto[] odds = oddsApiService.getOdds(sport, region, market);
            if (odds == null || odds.length == 0) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "No odds data available for the specified parameters");
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.ok(odds);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "An unexpected error occurred while fetching odds data");
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
