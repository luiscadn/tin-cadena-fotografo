package com.icesi.PhotoMarketApplication.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.icesi.PhotoMarketApplication.entity.Photograph;
import com.icesi.PhotoMarketApplication.entity.PhotographStatus;

@Repository
public interface PhotographRepository extends JpaRepository<Photograph, Long> {
    
    List<Photograph> findByStatus(PhotographStatus status);
    
    List<Photograph> findByPhotographerId(Long photographerId);
    
    List<Photograph> findByCategoryId(Long categoryId);
}