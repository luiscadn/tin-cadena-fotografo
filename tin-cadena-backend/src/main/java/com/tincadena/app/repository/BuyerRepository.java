package com.tincadena.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tincadena.app.entity.Buyer;   

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, Long> {
    
    Optional<Buyer> findByUserId(Long userId);
}