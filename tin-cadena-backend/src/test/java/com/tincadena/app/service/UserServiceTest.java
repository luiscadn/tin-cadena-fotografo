    package com.tincadena.app.service;

import com.tincadena.app.entity.Role;
import com.tincadena.app.entity.User;
import com.tincadena.app.repository.RoleRepository;
import com.tincadena.app.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;
    private Role role;

    @BeforeEach
    void setUp() {
        role = new Role();
        role.setId(1L);
        role.setName("PHOTOGRAPHER");

        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@photo.com");
        user.setPassword("password123");
    }

    @Test
    void testCreateUser_Success() {
        // Arrange
        when(roleRepository.findById(1L)).thenReturn(Optional.of(role));
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        User created = userService.createUser(user, 1L);

        // Assert
        assertNotNull(created);
        assertEquals(role, created.getRole());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testCreateUser_RoleNotFound() {
        // Regla: Evitar usuarios sin Rol 
        when(roleRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            userService.createUser(user, 99L);
        });
    }

    @Test
    void testGetAllUsers() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(user));
        assertEquals(1, userService.getAllUsers().size());
    }

    @Test
    void testUpdateUser_Success() {
        User updatedInfo = new User();
        updatedInfo.setName("New Name");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.updateUser(1L, updatedInfo);
        
        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testDeleteUser_NotFound() {
        when(userRepository.existsById(1L)).thenReturn(false);
        assertThrows(RuntimeException.class, () -> userService.deleteUser(1L));
    }

    @Test
    void testCreateUser_UsernameExists() {
        when(roleRepository.findById(anyLong())).thenReturn(Optional.of(role));
        when(userRepository.existsByUsername("testuser")).thenReturn(true);
        assertThrows(RuntimeException.class, () -> userService.createUser(user, 1L));
    }

    @Test
    void testUpdateUser_EmailAlreadyInUse() {
        User updatedInfo = new User();
        updatedInfo.setEmail("used@email.com");
        User otherUser = new User();
        otherUser.setId(2L); 

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.findByEmail("used@email.com")).thenReturn(Optional.of(otherUser));

        assertThrows(RuntimeException.class, () -> userService.updateUser(1L, updatedInfo));
    }

    @Test
    void testUpdateUser_NoFieldsProvided() {
        User emptyUpdate = new User(); 
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.updateUser(1L, emptyUpdate);
        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testChangeUserRole_Success() {
        Role newRole = new Role();
        newRole.setId(2L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(roleRepository.findById(2L)).thenReturn(Optional.of(newRole));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.changeUserRole(1L, 2L);
        assertEquals(newRole, result.getRole());
    }

    @Test
    void testCreateUser_EmailExists() {
        when(roleRepository.findById(anyLong())).thenReturn(Optional.of(role));
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail("test@photo.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> {
            userService.createUser(user, 1L);
        });
    }

    @Test
    void testGetUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        Optional<User> result = userService.getUserById(1L);
        assertTrue(result.isPresent());
    }

    @Test
    void testGetUserByUsername_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        Optional<User> result = userService.getUserByUsername("testuser");
        assertTrue(result.isPresent());
    }

    @Test
    void testUpdateUser_EmailAndPassword() {
        User updatedInfo = new User();
        updatedInfo.setEmail("new@email.com");
        updatedInfo.setPassword("newpassword");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.findByEmail("new@email.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(passwordEncoder.encode("newpassword")).thenReturn("hashedPassword");

        User result = userService.updateUser(1L, updatedInfo);
        
        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testDeleteUser_Success() {
        when(userRepository.existsById(1L)).thenReturn(true);
        doNothing().when(userRepository).deleteById(1L);

        assertDoesNotThrow(() -> userService.deleteUser(1L));
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void testCreateUser_RoleIsNullThrowsException() {
        // Simulamos que el repositorio devuelve vacío
        when(roleRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Esto ahora entrará directamente al IF de (role == null)
        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.createUser(user, 99L);
        });

        assertEquals("User must have a role assigned", exception.getMessage());
    }
}