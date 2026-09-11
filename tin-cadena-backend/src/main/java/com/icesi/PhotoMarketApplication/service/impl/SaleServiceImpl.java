package com.icesi.PhotoMarketApplication.service.impl;

import com.icesi.PhotoMarketApplication.dto.SaleDTO;
import com.icesi.PhotoMarketApplication.entity.Buyer;
import com.icesi.PhotoMarketApplication.entity.Photograph;
import com.icesi.PhotoMarketApplication.entity.Sale;
import com.icesi.PhotoMarketApplication.repository.BuyerRepository;
import com.icesi.PhotoMarketApplication.repository.PhotographRepository;
import com.icesi.PhotoMarketApplication.repository.SaleRepository;
import com.icesi.PhotoMarketApplication.service.SaleService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final BuyerRepository buyerRepository;
    private final PhotographRepository photographRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public SaleServiceImpl(SaleRepository saleRepository,
                           BuyerRepository buyerRepository,
                           PhotographRepository photographRepository,
                           SimpMessagingTemplate messagingTemplate) {
        this.saleRepository = saleRepository;
        this.buyerRepository = buyerRepository;
        this.photographRepository = photographRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public List<Sale> getAll() {
        return saleRepository.findAll();
    }

    @Override
    public Optional<Sale> getById(Long id) {
        return saleRepository.findById(id);
    }

    @Override
    @Transactional
    public Sale create(SaleDTO dto) {
        if (dto.getBuyerId() == null) {
            throw new RuntimeException("Buyer ID is required");
        }
        if (dto.getPhotographId() == null) {
            throw new RuntimeException("Photograph ID is required");
        }

        Buyer buyer = buyerRepository.findById(dto.getBuyerId())
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        Photograph photograph = photographRepository.findById(dto.getPhotographId())
                .orElseThrow(() -> new RuntimeException("Photograph not found"));

        if (photograph.getStatus() == com.icesi.PhotoMarketApplication.entity.PhotographStatus.SOLD) {
            throw new com.icesi.PhotoMarketApplication.exception.PhotographAlreadySoldException(
                "Photograph with ID " + photograph.getId() + " is already sold.");
        }

        photograph.setStatus(com.icesi.PhotoMarketApplication.entity.PhotographStatus.SOLD);
        photographRepository.save(photograph);

        Sale sale = new Sale();
        sale.setBuyer(buyer);
        sale.setPhotograph(photograph);
        if (dto.getTotalAmount() != null) {
            sale.setTotalAmount(dto.getTotalAmount());
        } else {
            sale.setTotalAmount(photograph.getPrice());
        }

        Sale saved = saleRepository.save(sale);

        // Notificar por WebSocket
        messagingTemplate.convertAndSend(
            "/topic/wishlist",
            "La fotografía con ID " + photograph.getId() + " ha sido vendida."
        );

        return saved;
    }

    @Override
    @Transactional
    public Sale update(Long id, SaleDTO dto) {
        Sale existing = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + id));

        if (dto.getBuyerId() != null) {
            Buyer buyer = buyerRepository.findById(dto.getBuyerId())
                    .orElseThrow(() -> new RuntimeException("Buyer not found"));
            existing.setBuyer(buyer);
        }
        if (dto.getPhotographId() != null) {
            Photograph photograph = photographRepository.findById(dto.getPhotographId())
                    .orElseThrow(() -> new RuntimeException("Photograph not found"));
            existing.setPhotograph(photograph);
        }
        if (dto.getTotalAmount() != null) {
            existing.setTotalAmount(dto.getTotalAmount());
        }

        return saleRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!saleRepository.existsById(id)) {
            throw new RuntimeException("Sale not found with id: " + id);
        }
        saleRepository.deleteById(id);
    }
}