package com.tincadena.app.service;

import com.tincadena.app.dto.PhotographerDTO;
import com.tincadena.app.entity.Photographer;

import java.util.List;
import java.util.Optional;

public interface PhotographerService {
    List<Photographer> getAll();
    Optional<Photographer> getById(Long id);
    Photographer create(PhotographerDTO dto);
    Photographer update(Long id, PhotographerDTO dto);
    void delete(Long id);
}
