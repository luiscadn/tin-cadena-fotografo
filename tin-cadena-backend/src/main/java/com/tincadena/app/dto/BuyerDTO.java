package com.tincadena.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuyerDTO {
    private Long id;
    private Long userId;
    private String address;
    private String phone;
}
