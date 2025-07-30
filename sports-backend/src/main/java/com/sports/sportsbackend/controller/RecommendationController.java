package com.sports.sportsbackend.controller;

import com.sports.sportsbackend.dto.AIResponseDto;
import com.sports.sportsbackend.dto.BetRequestDto;
import com.sports.sportsbackend.service.RecommendationService;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendation")
@CrossOrigin
public class RecommendationController {

    private RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping
    public ResponseEntity<AIResponseDto> getRecommendation(@RequestBody BetRequestDto request) {
        AIResponseDto response = recommendationService.getRecommendation(request);
        return ResponseEntity.ok(response);
    }
}
