package com.tincadena.app.service.impl;

import com.tincadena.app.dto.BuyerDTO;
import com.tincadena.app.entity.Buyer;
import com.tincadena.app.entity.User;
import com.tincadena.app.repository.BuyerRepository;
import com.tincadena.app.repository.UserRepository;
import com.tincadena.app.service.BuyerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BuyerServiceImpl implements BuyerService {

    private final BuyerRepository buyerRepository;
    private final UserRepository userRepository;

    public BuyerServiceImpl(BuyerRepository buyerRepository, UserRepository userRepository) {
        this.buyerRepository = buyerRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Buyer> getAll() {
        return buyerRepository.findAll();
    }

    @Override
    public Optional<Buyer> getById(Long id) {
        return buyerRepository.findById(id);
    }

    @Override
    @Transactional
    public Buyer create(BuyerDTO dto) {
        if (dto.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Buyer buyer = new Buyer();
        buyer.setUser(user);
        buyer.setAddress(dto.getAddress());
        buyer.setPhone(dto.getPhone());

        return buyerRepository.save(buyer);
    }

    @Override
    @Transactional
    public Buyer update(Long id, BuyerDTO dto) {
        Buyer existing = buyerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Buyer not found with id: " + id));

        if (dto.getAddress() != null) {
            existing.setAddress(dto.getAddress());
        }
        if (dto.getPhone() != null) {
            existing.setPhone(dto.getPhone());
        }
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            existing.setUser(user);
        }

        return buyerRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!buyerRepository.existsById(id)) {
            throw new RuntimeException("Buyer not found with id: " + id);
        }
        buyerRepository.deleteById(id);
    }
}
