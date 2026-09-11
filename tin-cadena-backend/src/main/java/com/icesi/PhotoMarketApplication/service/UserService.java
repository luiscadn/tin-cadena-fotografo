package com.icesi.PhotoMarketApplication.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.icesi.PhotoMarketApplication.entity.Role;
import com.icesi.PhotoMarketApplication.entity.User;
import com.icesi.PhotoMarketApplication.repository.RoleRepository;
import com.icesi.PhotoMarketApplication.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder; 

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Crear un nuevo usuario
     * REGLA: Un usuario DEBE tener un rol asignado
     */
    @Transactional
    public User createUser(User user, Long roleId) {
        
        Role role = roleRepository.findById(roleId).orElse(null);

        if (role == null) {
            throw new RuntimeException("User must have a role assigned");
        }
        
        // Validar username único
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists: " + user.getUsername());
        }
        
        // Validar email único (si existe)
        if (user.getEmail() != null && userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists: " + user.getEmail());
        }
        
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    /**
     * Obtener todos los usuarios
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Obtener usuario por ID
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Obtener usuario por username
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Actualizar usuario
     */
    @Transactional
    public User updateUser(Long id, User updatedUser) {
        
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Actualizar campos
        if (updatedUser.getName() != null) {
            existingUser.setName(updatedUser.getName());
        }
        
        if (updatedUser.getEmail() != null) {
            // Validar que el email no esté en uso por otro usuario
            Optional<User> userWithEmail = userRepository.findByEmail(updatedUser.getEmail());
            if (userWithEmail.isPresent() && !userWithEmail.get().getId().equals(id)) {
                throw new RuntimeException("Email already in use");
            }
            existingUser.setEmail(updatedUser.getEmail());
        }
        
        if (updatedUser.getPassword() != null) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        
        return userRepository.save(existingUser);
    }

    /**
     * Eliminar usuario
     */
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    /**
     * Cambiar rol de un usuario
     */
    @Transactional
    public User changeUserRole(Long userId, Long newRoleId) {
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Role newRole = roleRepository.findById(newRoleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        
        user.setRole(newRole);
        return userRepository.save(user);
    }
}