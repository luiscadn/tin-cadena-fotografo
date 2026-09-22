package com.tincadena.app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tincadena.app.dto.PhotographDTO;
import com.tincadena.app.entity.Category;
import com.tincadena.app.entity.Photograph;
import com.tincadena.app.entity.PhotographStatus;
import com.tincadena.app.entity.Photographer;
import com.tincadena.app.repository.CategoryRepository;
import com.tincadena.app.repository.PhotographRepository;
import com.tincadena.app.repository.PhotographerRepository;

@Service
public class PhotographService {

    private final PhotographRepository photographRepository;
    private final PhotographerRepository photographerRepository;
    private final CategoryRepository categoryRepository;

    public PhotographService(
            PhotographRepository photographRepository,
            PhotographerRepository photographerRepository,
            CategoryRepository categoryRepository) {
        this.photographRepository = photographRepository;
        this.photographerRepository = photographerRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Photograph> getAll() {
        return photographRepository.findAll();
    }

    public Optional<Photograph> getById(Long id) {
        return photographRepository.findById(id);
    }

    @Transactional
    public Photograph create(PhotographDTO dto) {
        if (dto.getPhotographerId() == null) {
            throw new RuntimeException("Photographer is required");
        }
        if (dto.getCategoryId() == null) {
            throw new RuntimeException("Category is required");
        }

        Photographer photographer = photographerRepository.findById(dto.getPhotographerId())
                .orElseThrow(() -> new RuntimeException("Photographer not found"));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Photograph photo = new Photograph();
        photo.setTitle(dto.getTitle());
        photo.setDescription(dto.getDescription());
        photo.setPrice(dto.getPrice());
        photo.setEdition(dto.getEdition());
        if (dto.getStatus() != null) {
            photo.setStatus(PhotographStatus.valueOf(dto.getStatus()));
        }
        photo.setPhotographer(photographer);
        photo.setCategory(category);
        photo.setImage(dto.getImage());

        return photographRepository.save(photo);
    }

    @Transactional
    public Photograph update(Long id, PhotographDTO dto) {
        Photograph existing = photographRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Photograph not found with id: " + id));

        if (dto.getTitle() != null) {
            existing.setTitle(dto.getTitle());
        }
        if (dto.getDescription() != null) {
            existing.setDescription(dto.getDescription());
        }
        if (dto.getPrice() != null) {
            existing.setPrice(dto.getPrice());
        }
        if (dto.getEdition() != null) {
            existing.setEdition(dto.getEdition());
        }
        if (dto.getStatus() != null) {
            existing.setStatus(PhotographStatus.valueOf(dto.getStatus()));
        }
        if (dto.getImage() != null) {
            existing.setImage(dto.getImage());
        }
        if (dto.getPhotographerId() != null) {
            Photographer photographer = photographerRepository.findById(dto.getPhotographerId())
                    .orElseThrow(() -> new RuntimeException("Photographer not found"));
            existing.setPhotographer(photographer);
        }
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            existing.setCategory(category);
        }

        return photographRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!photographRepository.existsById(id)) {
            throw new RuntimeException("Photograph not found with id: " + id);
        }
        photographRepository.deleteById(id);
    }
}
