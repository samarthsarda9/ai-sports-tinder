package com.sports.sportsbackend.repository;

import com.sports.sportsbackend.model.Bet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BetRepository extends JpaRepository<Bet, Long> {

    List<Bet> findAllByStatus(Bet.Status betStatus);

    List<Bet> findByUserId(Long userId);

    List<Bet> findByUserIdAndStatus(Long userId, Bet.Status betStatus);

    List<Bet> findByGameIdAndStatus(String id, Bet.Status status);
}
