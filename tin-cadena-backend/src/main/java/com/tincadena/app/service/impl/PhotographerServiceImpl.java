package com.tincadena.app.service.impl;

import com.tincadena.app.dto.PhotographerDTO;
import com.tincadena.app.entity.Photographer;
import com.tincadena.app.entity.User;
import com.tincadena.app.repository.PhotographerRepository;
import com.tincadena.app.repository.UserRepository;
import com.tincadena.app.service.PhotographerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PhotographerServiceImpl implements PhotographerService {

    private final PhotographerRepository photographerRepository;
    private final UserRepository userRepository;

    public PhotographerServiceImpl(PhotographerRepository photographerRepository, UserRepository userRepository) {
        this.photographerRepository = photographerRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Photographer> getAll() {
        return photographerRepository.findAll();
    }

    @Override
    public Optional<Photographer> getById(Long id) {
        return photographerRepository.findById(id);
    }

    @Override
    @Transactional
    public Photographer create(PhotographerDTO dto) {
        if (dto.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Photographer photographer = new Photographer();
        photographer.setUser(user);
        photographer.setBio(dto.getBio());
        photographer.setWebsite(dto.getWebsite());
        photographer.setPhone(dto.getPhone());

        return photographerRepository.save(photographer);
    }

    @Override
    @Transactional
    public Photographer update(Long id, PhotographerDTO dto) {
        Photographer existing = photographerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Photographer not found with id: " + id));

        if (dto.getBio() != null) {
            existing.setBio(dto.getBio());
        }
        if (dto.getWebsite() != null) {
            existing.setWebsite(dto.getWebsite());
        }
        if (dto.getPhone() != null) {
            existing.setPhone(dto.getPhone());
        }
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            existing.setUser(user);
        }

        return photographerRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!photographerRepository.existsById(id)) {
            throw new RuntimeException("Photographer not found with id: " + id);
        }
        photographerRepository.deleteById(id);
    }
}
