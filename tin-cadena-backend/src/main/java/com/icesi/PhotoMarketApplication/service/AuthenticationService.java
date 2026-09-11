package com.icesi.PhotoMarketApplication.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesi.PhotoMarketApplication.dto.RegisterRequest;
import com.icesi.PhotoMarketApplication.entity.Role;
import com.icesi.PhotoMarketApplication.entity.User;
import com.icesi.PhotoMarketApplication.repository.RoleRepository;
import com.icesi.PhotoMarketApplication.repository.UserRepository;

/**
 * Servicio de autenticación
 * Maneja el registro de usuarios y hasheo de contraseñas
 */
@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository, 
                                  RoleRepository roleRepository,
                                  PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registrar un nuevo usuario
     */
    @Transactional
    public User register(RegisterRequest request) {
        
        // Validar que el username no exista
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }

        // Validar que el email no exista (si se proporciona)
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        // Obtener el rol (con validación de seguridad)
        Role role;
        if (request.getRoleId() != null) {
            role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            
            // Seguridad: Evitar auto-asignación de rol ADMIN
            if ("ADMIN".equals(role.getName())) {
                throw new RuntimeException("No puedes asignarte el rol ADMIN. Contacta a un administrador.");
            }
        } else {
            // Buscar rol BUYER por defecto (más adecuado para nuevos usuarios)
            role = roleRepository.findByName("BUYER")
                    .orElseThrow(() -> new RuntimeException("Default BUYER role not found"));
        }

        // Crear usuario
        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        
        // Hashear la contraseña ANTES de guardar
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        user.setRole(role);

        return userRepository.save(user);
    }

    /**
     * Validar credenciales (opcional, Spring Security lo hace automáticamente)
     */
    public boolean validateCredentials(String username, String rawPassword) {
        return userRepository.findByUsername(username)
                .map(user -> passwordEncoder.matches(rawPassword, user.getPassword()))
                .orElse(false);
    }
}