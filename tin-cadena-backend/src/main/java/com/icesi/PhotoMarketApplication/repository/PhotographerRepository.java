package com.icesi.PhotoMarketApplication.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icesi.PhotoMarketApplication.entity.Photographer;

@Repository
public interface PhotographerRepository extends JpaRepository<Photographer, Long> {
    
    Optional<Photographer> findByUserId(Long userId);
}