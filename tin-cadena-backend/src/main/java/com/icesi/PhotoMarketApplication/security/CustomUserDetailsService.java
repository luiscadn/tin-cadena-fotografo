package com.icesi.PhotoMarketApplication.security;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.icesi.PhotoMarketApplication.entity.Permission;
import com.icesi.PhotoMarketApplication.entity.User;
import com.icesi.PhotoMarketApplication.repository.UserRepository;

/**
 * Implementación personalizada de UserDetailsService
 * Spring Security usa esta clase para cargar usuarios durante la autenticación
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        // Buscar usuario en la base de datos
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Convertir permisos del rol a GrantedAuthority
        Set<GrantedAuthority> authorities = user.getRole()
                .getPermissions()
                .stream()
                .map(Permission::getName)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());

        // Agregar el rol como autoridad (prefijo ROLE_)
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()));

        // Retornar UserDetails de Spring Security
        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .build();
    }
}