package com.icesi.PhotoMarketApplication.service;

import com.icesi.PhotoMarketApplication.dto.PhotographerDTO;
import com.icesi.PhotoMarketApplication.entity.Photographer;

import java.util.List;
import java.util.Optional;

public interface PhotographerService {
    List<Photographer> getAll();
    Optional<Photographer> getById(Long id);
    Photographer create(PhotographerDTO dto);
    Photographer update(Long id, PhotographerDTO dto);
    void delete(Long id);
}
