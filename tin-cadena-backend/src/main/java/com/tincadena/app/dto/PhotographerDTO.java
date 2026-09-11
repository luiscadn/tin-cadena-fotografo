package com.tincadena.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotographerDTO {
    private Long id;
    private Long userId;
    private String bio;
    private String website;
    private String phone;
}
