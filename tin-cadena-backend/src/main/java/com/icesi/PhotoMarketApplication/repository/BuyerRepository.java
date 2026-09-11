package com.icesi.PhotoMarketApplication.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icesi.PhotoMarketApplication.entity.Buyer;   

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, Long> {
    
    Optional<Buyer> findByUserId(Long userId);
}