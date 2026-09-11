package com.icesi.PhotoMarketApplication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateUpdateDTO {
    private String name;
    private String username;
    private String password;
    private String email;
    private Long roleId;
}
