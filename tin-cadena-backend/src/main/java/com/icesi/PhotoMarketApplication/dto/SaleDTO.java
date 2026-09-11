package com.icesi.PhotoMarketApplication.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleDTO {
    private Long id;
    private Long buyerId;
    private Long photographId;
    private LocalDateTime saleDate;
    private BigDecimal totalAmount;
}
