package com.sports.sportsbackend.controller;

import com.sports.sportsbackend.dto.BetDto;
import com.sports.sportsbackend.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendation")
@CrossOrigin
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ResponseEntity<List<BetDto>> getRecommendations(@RequestParam String sport) {
        List<BetDto> response = recommendationService.getRecommendations(sport);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/testing")
    public ResponseEntity<String> testing(@RequestParam String sport) {
        String response = recommendationService.testing(sport);
        return ResponseEntity.ok(response);
    }
}
