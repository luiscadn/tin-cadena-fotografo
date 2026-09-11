package com.tincadena.app.service;

import com.tincadena.app.dto.SaleDTO;
import com.tincadena.app.entity.Sale;

import java.util.List;
import java.util.Optional;

public interface SaleService {
    List<Sale> getAll();
    Optional<Sale> getById(Long id);
    Sale create(SaleDTO dto);
    Sale update(Long id, SaleDTO dto);
    void delete(Long id);
}
