package com.tincadena.app.service;

import com.tincadena.app.dto.BuyerDTO;
import com.tincadena.app.entity.Buyer;

import java.util.List;
import java.util.Optional;

public interface BuyerService {
    List<Buyer> getAll();
    Optional<Buyer> getById(Long id);
    Buyer create(BuyerDTO dto);
    Buyer update(Long id, BuyerDTO dto);
    void delete(Long id);
}
