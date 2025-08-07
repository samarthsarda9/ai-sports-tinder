package com.sports.sportsbackend.controller;

import com.sports.sportsbackend.dto.BetDto;
import com.sports.sportsbackend.dto.BetRequestDto;
import com.sports.sportsbackend.model.Bet;
import com.sports.sportsbackend.model.User;
import com.sports.sportsbackend.security.service.JwtService;
import com.sports.sportsbackend.service.BetService;
import com.sports.sportsbackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bets")
@CrossOrigin
public class BetController {

    private final BetService betService;
    private final JwtService jwtService;
    private final UserService userService;

    public BetController(BetService betService, JwtService jwtService, UserService userService) {
        this.betService = betService;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<BetDto>> getAllBets() {
        return ResponseEntity.ok(betService.getAllBets());
    }

    @GetMapping("/user")
    public ResponseEntity<List<BetDto>> getAllBetsByUser() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(betService.getBetsByUser(userId));
    }

    @GetMapping("/active")
    public ResponseEntity<List<BetDto>> getAllActiveBets() {
        return ResponseEntity.ok(betService.getActiveBets());
    }

    @GetMapping("/user/active")
    public ResponseEntity<List<BetDto>> getAllActiveBetsByUser() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(betService.getActiveBetsByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BetDto> getBetById(@PathVariable Long id) {
        Optional<BetDto> betDto = betService.getBetById(id);
        return betDto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> placeBet(@RequestBody BetRequestDto request) {
        try {
            Long userId = getCurrentUserId();
            BetDto placedBet = betService.placeBet(request, userId);

            Map<String, Object> response = new HashMap<>();
            response.put("placedBet", placedBet);
            response.put("message", "Bet placed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof User)) {
            throw new RuntimeException("User not authenticated");
        }
        return ((User) authentication.getPrincipal()).getId();
    }

//    @PutMapping("/{id}/status")
//    public ResponseEntity<?> updateBetStatus(@PathVariable Long id, @RequestBody BetRequestDto request) {
//        try {
//            String statusStr = request.get("status").toString();
//            Bet.BetStatus status = Bet.BetStatus.valueOf(statusStr.toUpperCase());
//
//            BetDto updatedBet = betService.updateBetStatus(id, status);
//            Map<String, Object> response = new HashMap<>();
//            response.put("updatedBet", updatedBet);
//            response.put("message", "Bet updated successfully");
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            Map<String, Object> error = new HashMap<>();
//            error.put("error", e.getMessage());
//            return ResponseEntity.badRequest().body(error);
//        }
//    }

}
