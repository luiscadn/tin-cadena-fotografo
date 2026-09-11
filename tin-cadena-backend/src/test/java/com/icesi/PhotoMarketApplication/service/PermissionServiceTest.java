package com.icesi.PhotoMarketApplication.service;

import com.icesi.PhotoMarketApplication.entity.Permission;
import com.icesi.PhotoMarketApplication.repository.PermissionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PermissionServiceTest {

    @Mock
    private PermissionRepository permissionRepository;

    @InjectMocks
    private PermissionService permissionService;

    private Permission permission;

    @BeforeEach
    void setUp() {
        permission = new Permission();
        permission.setId(1L);
        permission.setName("READ_PRIVILEGE");
    }

    @Test
    void testGetAllPermissions() {
        // Arrange
        when(permissionRepository.findAll()).thenReturn(Arrays.asList(permission));

        // Act
        List<Permission> result = permissionService.getAllPermissions();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(permissionRepository, times(1)).findAll();
    }

    @Test
    void testGetPermissionById() {
        // Arrange
        when(permissionRepository.findById(1L)).thenReturn(Optional.of(permission));

        // Act
        Optional<Permission> result = permissionService.getPermissionById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("READ_PRIVILEGE", result.get().getName());
        verify(permissionRepository).findById(1L);
    }

    @Test
    void testCreatePermission() {
        // Arrange
        when(permissionRepository.save(any(Permission.class))).thenReturn(permission);

        // Act
        Permission saved = permissionService.createPermission(new Permission());

        // Assert
        assertNotNull(saved);
        assertEquals("READ_PRIVILEGE", saved.getName());
        verify(permissionRepository).save(any(Permission.class));
    }

    @Test
    void testDeletePermission() {
        // Arrange
        when(permissionRepository.existsById(1L)).thenReturn(true);
        doNothing().when(permissionRepository).deleteById(1L);

        // Act
        permissionService.deletePermission(1L);

        // Assert
        verify(permissionRepository).existsById(1L);
        verify(permissionRepository).deleteById(1L);
    }

    @Test
    void testDeletePermissionNotFound() {
        // Arrange
        when(permissionRepository.existsById(99L)).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            permissionService.deletePermission(99L);
        });
    }

    @Test
    void testGetPermissionByName() {
        when(permissionRepository.findByName("READ")).thenReturn(Optional.of(permission));
        Optional<Permission> result = permissionService.getPermissionByName("READ");
        assertTrue(result.isPresent());
}
}