package com.tincadena.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tincadena.app.entity.Sale;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    
    List<Sale> findByBuyerId(Long buyerId);
    
    boolean existsByPhotographId(Long photographId);
}