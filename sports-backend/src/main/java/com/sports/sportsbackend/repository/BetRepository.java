package com.sports.sportsbackend.repository;

import com.sports.sportsbackend.model.Bet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BetRepository extends JpaRepository<Bet, Long> {

    Optional<Bet> findAllByStatus(Bet.BetStatus betStatus);

    List<Bet> findByUserId(Long userId);

    List<Bet> findByUserIdAndStatus(Long userId, Bet.BetStatus betStatus);
}
