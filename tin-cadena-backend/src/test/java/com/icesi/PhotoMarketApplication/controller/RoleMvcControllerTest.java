package com.icesi.PhotoMarketApplication.controller;

import com.icesi.PhotoMarketApplication.entity.Permission;
import com.icesi.PhotoMarketApplication.entity.Role;
import com.icesi.PhotoMarketApplication.service.PermissionService;
import com.icesi.PhotoMarketApplication.service.RoleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ui.Model;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para RoleMvcController.
 * Verifican que cada endpoint retorne la vista correcta
 * y que el Model reciba los atributos esperados.
 *
 * Patrón: Given / When / Then
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("RoleMvcController - Pruebas Unitarias")
class RoleMvcControllerTest {

    @Mock
    private RoleService roleService;

    @Mock
    private PermissionService permissionService;

    @Mock
    private Model model;

    @Mock
    private RedirectAttributes redirectAttributes;

    @InjectMocks
    private RoleMvcController controller;

    // ── Datos de prueba ─────────────────────────────────────────────────
    private Permission permRead;
    private Permission permWrite;
    private Role roleAdmin;

    @BeforeEach
    void setUp() {
        permRead  = new Permission(1L, "READ");
        permWrite = new Permission(2L, "WRITE");

        Set<Permission> perms = new HashSet<>();
        perms.add(permRead);
        roleAdmin = new Role(1L, "ADMIN", perms);
    }

    // GET /roles — Listar roles

    @Test
    @DisplayName("listRoles → retorna vista 'roles/list' con todos los roles en el modelo")
    void listRoles_debeRetornarVistaListConRoles() {
        // Given
        List<Role> roles = List.of(roleAdmin);
        when(roleService.getAllRoles()).thenReturn(roles);

        // When
        String viewName = controller.listRoles(model);

        // Then
        assertThat(viewName).isEqualTo("roles/list");
        verify(model).addAttribute("roles", roles);
        verify(model).addAttribute(eq("pageTitle"), anyString());
    }

    // ════════════════════════════════════════════════════════════════════
    // GET /roles/new — Formulario creación
    // ════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("showCreateForm → retorna vista 'roles/form' con lista de permisos disponibles")
    void showCreateForm_debeRetornarVistaFormConPermisos() {
        // Given
        List<Permission> perms = List.of(permRead, permWrite);
        when(permissionService.getAllPermissions()).thenReturn(perms);

        // When
        String viewName = controller.showCreateForm(model);

        // Then
        assertThat(viewName).isEqualTo("roles/form");
        verify(model).addAttribute(eq("role"), any(Role.class));
        verify(model).addAttribute("allPermissions", perms);
    }

    // POST /roles/new — Crear rol exitoso

    @Test
    @DisplayName("createRole exitoso → redirige a /roles con mensaje de éxito")
    void createRole_exitoso_debeRedirigirALista() {
        // Given
        Set<Long> ids = Set.of(1L, 2L);
        when(roleService.createRole(any(Role.class), eq(ids))).thenReturn(roleAdmin);

        // When
        String viewName = controller.createRole(roleAdmin, ids, redirectAttributes);

        // Then
        assertThat(viewName).isEqualTo("redirect:/roles");
        verify(redirectAttributes).addFlashAttribute(eq("successMessage"), contains("ADMIN"));
    }

    @Test
    @DisplayName("createRole sin permisos → redirige a /roles/new con error")
    void createRole_sinPermisos_debeRedirigirAFormularioConError() {
        // Given
        when(roleService.createRole(any(Role.class), isNull()))
                .thenThrow(new RuntimeException("Role must have at least one permission"));

        // When
        String viewName = controller.createRole(roleAdmin, null, redirectAttributes);

        // Then
        assertThat(viewName).isEqualTo("redirect:/roles/new");
        verify(redirectAttributes).addFlashAttribute(eq("errorMessage"),
                contains("at least one permission"));
    }

    @Test
    @DisplayName("createRole nombre duplicado → redirige a /roles/new con error")
    void createRole_nombreDuplicado_debeRedirigirConError() {
        // Given
        Set<Long> ids = Set.of(1L);
        when(roleService.createRole(any(Role.class), eq(ids)))
                .thenThrow(new RuntimeException("Role name already exists: ADMIN"));

        // When
        String viewName = controller.createRole(roleAdmin, ids, redirectAttributes);

        // Then
        assertThat(viewName).isEqualTo("redirect:/roles/new");
        verify(redirectAttributes).addFlashAttribute(eq("errorMessage"), contains("already exists"));
    }

    // GET /roles/{id}/permissions — Ver permisos de un rol

    @Test
    @DisplayName("showPermissionsForm rol existente → retorna vista 'roles/permissions'")
    void showPermissionsForm_rolExistente_debeRetornarVista() {
        // Given
        when(roleService.getRoleById(1L)).thenReturn(Optional.of(roleAdmin));
        when(permissionService.getAllPermissions()).thenReturn(List.of(permRead, permWrite));

        // When
        String viewName = controller.showPermissionsForm(1L, model);

        // Then
        assertThat(viewName).isEqualTo("roles/permissions");
        verify(model).addAttribute("role", roleAdmin);
        verify(model).addAttribute("allPermissions", List.of(permRead, permWrite));
    }

    @Test
    @DisplayName("showPermissionsForm rol inexistente → lanza RuntimeException")
    void showPermissionsForm_rolInexistente_debeLanzarExcepcion() {
        // Given
        when(roleService.getRoleById(99L)).thenReturn(Optional.empty());

        // When / Then
        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class,
                () -> controller.showPermissionsForm(99L, model));
    }

    // POST /roles/{roleId}/permissions/{permissionId}/add

    @Test
    @DisplayName("addPermission exitoso → redirige a la vista de permisos del rol")
    void addPermission_exitoso_debeRedirigirAPermisos() {
        // Given
        when(roleService.addPermissionToRole(1L, 2L)).thenReturn(roleAdmin);

        // When
        String viewName = controller.addPermission(1L, 2L, redirectAttributes);

        // Then
        assertThat(viewName).isEqualTo("redirect:/roles/1/permissions");
        verify(redirectAttributes).addFlashAttribute(eq("successMessage"), anyString());
    }

    // POST /roles/{roleId}/permissions/{permissionId}/remove

    @Test
    @DisplayName("removePermission exitoso → redirige a la vista de permisos del rol")
    void removePermission_exitoso_debeRedirigirAPermisos() {
        // Given
        when(roleService.removePermissionFromRole(1L, 1L)).thenReturn(roleAdmin);

        // When
        String viewName = controller.removePermission(1L, 1L, redirectAttributes);

        // Then
        assertThat(viewName).isEqualTo("redirect:/roles/1/permissions");
        verify(redirectAttributes).addFlashAttribute(eq("successMessage"), anyString());
    }

    @Test
    @DisplayName("removePermission último permiso → redirige con mensaje de error")
    void removePermission_ultimoPermiso_debeRedirigirConError() {
        // Given
        when(roleService.removePermissionFromRole(1L, 1L))
                .thenThrow(new RuntimeException("Cannot remove last permission from role"));

        // When
        String viewName = controller.removePermission(1L, 1L, redirectAttributes);

        // Then
        assertThat(viewName).isEqualTo("redirect:/roles/1/permissions");
        verify(redirectAttributes).addFlashAttribute(eq("errorMessage"),
                contains("Cannot remove last permission"));
    }

    // POST /roles/{id}/delete — Eliminar rol

    @Test
    @DisplayName("deleteRole existente → redirige a /roles con mensaje de éxito")
    void deleteRole_existente_debeRedirigirALista() {
        // Given
        doNothing().when(roleService).deleteRole(1L);

        // When
        String viewName = controller.deleteRole(1L, redirectAttributes);

        // Then
        assertThat(viewName).isEqualTo("redirect:/roles");
        verify(roleService).deleteRole(1L);
        verify(redirectAttributes).addFlashAttribute(eq("successMessage"), anyString());
    }

    @Test
    @DisplayName("deleteRole inexistente → redirige a /roles con mensaje de error")
    void deleteRole_inexistente_debeRedirigirConError() {
        // Given
        doThrow(new RuntimeException("Role not found with id: 99"))
                .when(roleService).deleteRole(99L);

        // When
        String viewName = controller.deleteRole(99L, redirectAttributes);

        // Then
        assertThat(viewName).isEqualTo("redirect:/roles");
        verify(redirectAttributes).addFlashAttribute(eq("errorMessage"), contains("not found"));
    }
}
