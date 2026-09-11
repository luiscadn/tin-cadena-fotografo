package com.icesi.PhotoMarketApplication.dto;

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
    private LocalDateTime createdAt;
}
