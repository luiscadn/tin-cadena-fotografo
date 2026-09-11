package com.tincadena.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tincadena.app.entity.Photographer;

@Repository
public interface PhotographerRepository extends JpaRepository<Photographer, Long> {
    
    Optional<Photographer> findByUserId(Long userId);
}