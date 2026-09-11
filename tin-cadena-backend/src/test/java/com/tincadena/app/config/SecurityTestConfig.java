package com.tincadena.app.config;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import com.tincadena.app.security.JwtService;
import com.tincadena.app.security.CustomUserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Clase base para pruebas WebMvcTest.
 * Centraliza la inyección de dependencias de seguridad requeridas por el ApplicationContext
 * para evitar colisiones o falta de beans en los tests.
 */
public abstract class SecurityTestConfig {

    @MockitoBean
    protected JwtService jwtService;

    @MockitoBean
    protected CustomUserDetailsService customUserDetailsService;

    @MockitoBean
    protected PasswordEncoder passwordEncoder;
}
