package com.tincadena.app.service;

import com.tincadena.app.entity.Permission;
import com.tincadena.app.entity.Role;
import com.tincadena.app.repository.PermissionRepository;
import com.tincadena.app.repository.RoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PermissionRepository permissionRepository;

    @InjectMocks
    private RoleService roleService;

    private Role role;
    private Permission permission;

    @BeforeEach
    void setUp() {
        permission = new Permission();
        permission.setId(1L);
        permission.setName("READ");

        role = new Role();
        role.setId(1L);
        role.setName("PHOTOGRAPHER");
        role.setPermissions(new HashSet<>(Collections.singletonList(permission)));
    }

    @Test
    void testCreateRole_Success() {
        // Arrange
        Set<Long> pIds = new HashSet<>(Collections.singletonList(1L));
        when(roleRepository.existsByName(anyString())).thenReturn(false);
        when(permissionRepository.findAllById(pIds)).thenReturn(Collections.singletonList(permission));
        when(roleRepository.save(any(Role.class))).thenReturn(role);

        // Act
        Role created = roleService.createRole(role, pIds);

        // Assert
        assertNotNull(created);
        assertEquals(1, created.getPermissions().size());
        verify(roleRepository).save(any(Role.class));
    }

    @Test
    void testCreateRole_NoPermissionsThrowsException() {
        // Evita Roles sin permisos  
        Set<Long> emptyIds = new HashSet<>();

        assertThrows(RuntimeException.class, () -> {
            roleService.createRole(role, emptyIds);
        });
    }

    @Test
    void testAddPermissionToRole_Success() {
        Permission newPerm = new Permission();
        newPerm.setId(2L);
        
        when(roleRepository.findById(1L)).thenReturn(Optional.of(role));
        when(permissionRepository.findById(2L)).thenReturn(Optional.of(newPerm));
        when(roleRepository.save(any(Role.class))).thenReturn(role);

        Role result = roleService.addPermissionToRole(1L, 2L);

        assertNotNull(result);
        verify(roleRepository).save(any(Role.class));
    }

    @Test
    void testRemoveLastPermissionThrowsException() {
        // No se puede dejar el rol sin permisos
        when(roleRepository.findById(1L)).thenReturn(Optional.of(role));
        when(permissionRepository.findById(1L)).thenReturn(Optional.of(permission));

        assertThrows(RuntimeException.class, () -> {
            roleService.removePermissionFromRole(1L, 1L);
        });
    }

    @Test
    void testDeleteRole_Success() {
        when(roleRepository.existsById(1L)).thenReturn(true);
        doNothing().when(roleRepository).deleteById(1L);

        roleService.deleteRole(1L);

        verify(roleRepository).deleteById(1L);
    }

    @Test
    void testCreateRole_NameExists() {
        when(roleRepository.existsByName(anyString())).thenReturn(true);
        assertThrows(RuntimeException.class, () -> roleService.createRole(role, new HashSet<>(Arrays.asList(1L))));
    }

    @Test
    void testCreateRole_NoValidPermissionsFound() {
        Set<Long> pIds = new HashSet<>(Arrays.asList(1L));
        when(roleRepository.existsByName(anyString())).thenReturn(false);
        when(permissionRepository.findAllById(pIds)).thenReturn(new ArrayList<>()); // Lista vacía

        assertThrows(RuntimeException.class, () -> roleService.createRole(role, pIds));
    }

    @Test
    void testGetAllRoles() {
        when(roleRepository.findAll()).thenReturn(Arrays.asList(role));
        assertFalse(roleService.getAllRoles().isEmpty());
    }

    @Test
    void testGetRoleByIdNotFound() {
        when(roleRepository.findById(99L)).thenReturn(Optional.empty());
        Optional<Role> result = roleService.getRoleById(99L);
        assertTrue(result.isEmpty());
    }

    @Test
    void testAddPermissionToRole_RoleNotFound() {
        when(roleRepository.findById(anyLong())).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> roleService.addPermissionToRole(99L, 1L));
    }

    @Test
    void testGetRoleByName_Success() {
        when(roleRepository.findByName("PHOTOGRAPHER")).thenReturn(Optional.of(role));
        
        Optional<Role> result = roleService.getRoleByName("PHOTOGRAPHER");
        
        assertTrue(result.isPresent());
        assertEquals("PHOTOGRAPHER", result.get().getName());
        verify(roleRepository).findByName("PHOTOGRAPHER");
    }

    @Test
    void testRemovePermissionFromRole_Success() {
        Permission perm1 = new Permission(); perm1.setId(1L);
        Permission perm2 = new Permission(); perm2.setId(2L);
        
        role.getPermissions().add(perm2); 
        
        when(roleRepository.findById(1L)).thenReturn(Optional.of(role));
        when(permissionRepository.findById(2L)).thenReturn(Optional.of(perm2));
        when(roleRepository.save(any(Role.class))).thenReturn(role);

        Role result = roleService.removePermissionFromRole(1L, 2L);

        assertNotNull(result);
        assertEquals(1, result.getPermissions().size());
        verify(roleRepository).save(any(Role.class));
    }

    @Test
    void testDeleteRole_NotFound() {
        when(roleRepository.existsById(99L)).thenReturn(false);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            roleService.deleteRole(99L);
        });

        assertTrue(exception.getMessage().contains("Role not found with id: 99"));
        verify(roleRepository, never()).deleteById(anyLong());
    }
}