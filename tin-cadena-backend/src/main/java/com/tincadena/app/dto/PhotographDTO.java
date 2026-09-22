package com.tincadena.app.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotographDTO {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer edition;
    private String status;
    private Long photographerId;
    private Long categoryId;
    private String image;
    private LocalDateTime createdAt;

    public PhotographDTO(Long id, String title, String description, BigDecimal price, Integer edition, String status, Long photographerId, Long categoryId, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.edition = edition;
        this.status = status;
        this.photographerId = photographerId;
        this.categoryId = categoryId;
        this.image = null;
        this.createdAt = createdAt;
    }
}
