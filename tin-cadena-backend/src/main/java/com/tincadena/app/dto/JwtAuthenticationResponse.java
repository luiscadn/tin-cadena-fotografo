package com.tincadena.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para respuesta de autenticación JWT
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtAuthenticationResponse {

    private String token;
    private String type = "Bearer";
    private String username;
    private List<String> roles;
    private Long expiresIn; // milisegundos
}