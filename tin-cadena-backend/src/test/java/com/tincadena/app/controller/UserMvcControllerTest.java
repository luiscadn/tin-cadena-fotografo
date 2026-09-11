package com.tincadena.app.controller;

import com.tincadena.app.entity.Permission;
import com.tincadena.app.entity.Role;
import com.tincadena.app.entity.User;
import com.tincadena.app.service.RoleService;
import com.tincadena.app.service.UserService;
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
 * Pruebas unitarias para UserMvcController.
 * Verifican que cada endpoint retorne la vista correcta
 * y que el Model reciba los atributos esperados.
 *
 * Patrón: Given / When / Then
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserMvcController - Pruebas Unitarias")
class UserMvcControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private RoleService roleService;

    @Mock
    private Model model;

    @Mock
    private RedirectAttributes redirectAttributes;

    @InjectMocks
    private UserMvcController controller;

    private Role roleAdmin;
    private User sampleUser;

    @BeforeEach
    void setUp() {
        Set<Permission> perms = new HashSet<>();
        perms.add(new Permission(1L, "READ"));
        perms.add(new Permission(2L, "WRITE"));

        roleAdmin = new Role(1L, "ADMIN", perms);
        sampleUser = new User(1L, "Juan Pérez", "juanp", "pass123", "juan@test.com", roleAdmin, null);
    }

    // GET /users — Listar usuarios

    @Test
    @DisplayName("listUsers → retorna vista 'users/list' con lista de usuarios en el modelo")
    void listUsers_debeRetornarVistaListConUsuarios() {
        // Given
        List<User> expected = List.of(sampleUser);
        when(userService.getAllUsers()).thenReturn(expected);

        // When
        String viewName = controller.listUsers(model);

        // Then
        assertThat(viewName).isEqualTo("users/list");
        verify(model).addAttribute("users", expected);
        verify(model).addAttribute(eq("pageTitle"), anyString());
    }

    // GET /users/new — Formulario de registro

    @Test
    @DisplayName("showCreateForm → retorna vista 'users/form' e incluye roles disponibles")
    void showCreateForm_debeRetornarVistaFormConRoles() {
        // Given
        List<Role> roles = List.of(roleAdmin);
        when(roleService.getAllRoles()).thenReturn(roles);

        // When
        String viewName = controller.showCreateForm(model);

        // Then
        assertThat(viewName).isEqualTo("users/form");
        verify(model).addAttribute(eq("user"), any(User.class));
        verify(model).addAttribute("roles", roles);
    }

    // POST /users/new — Crear usuario exitoso

    @Test
    @DisplayName("createUser exitoso → redirige a /users y agrega mensaje de éxito")
    void createUser_exitoso_debeRedirigirALista() {
        // Given
        when(userService.createUser(any(User.class), eq(1L))).thenReturn(sampleUser);

        // When
        String viewName = controller.createUser(sampleUser, 1L, redirectAttributes);

        // Then
        assertThat(viewName).isEqualTo("redirect:/users");
        verify(redirectAttributes).addFlashAttribute(eq("successMessage"), contains("juanp"));
    }

    @Test
    @DisplayName("createUser con username duplicado → redirige a /users/new con error")
    void createUser_usernameDuplicado_debeRedirigirAFormulario() {
        // Given
        when(userService.createUser(any(User.class), anyLong()))
                .thenThrow(new RuntimeException("Username already exists: juanp"));

        // When
        String viewName = controller.createUser(sampleUser, 1L, redirectAttributes);

        // Then
        assertThat(viewName).isEqualTo("redirect:/users/new");
        verify(redirectAttributes).addFlashAttribute(eq("errorMessage"), contains("Username already exists"));
    }

    // GET /users/{id}/assign-role — Formulario asignación de rol

    @Test
    @DisplayName("showAssignRoleForm usuario existente → retorna vista 'users/assign-role'")
    void showAssignRoleForm_usuarioExistente_debeRetornarVista() {
        // Given
        when(userService.getUserById(1L)).thenReturn(Optional.of(sampleUser));
        when(roleService.getAllRoles()).thenReturn(List.of(roleAdmin));

        // When
        String viewName = controller.showAssignRoleForm(1L, model);

        // Then
        assertThat(viewName).isEqualTo("users/assign-role");
        verify(model).addAttribute("user", sampleUser);
        verify(model).addAttribute("roles", List.of(roleAdmin));
    }

    @Test
    @DisplayName("showAssignRoleForm usuario inexistente → lanza RuntimeException")
    void showAssignRoleForm_usuarioInexistente_debeLanzarExcepcion() {
        // Given
        when(userService.getUserById(99L)).thenReturn(Optional.empty());

        // When / Then
        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class,
                () -> controller.showAssignRoleForm(99L, model));
    }

    // POST /users/{id}/assign-role — Cambiar rol

    @Test
    @DisplayName("assignRole exitoso → redirige a /users con mensaje de éxito")
    void assignRole_exitoso_debeRedirigirALista() {
        // Given
        when(userService.changeUserRole(1L, 2L)).thenReturn(sampleUser);

        // When
        String viewName = controller.assignRole(1L, 2L, redirectAttributes);

        // Then
        assertThat(viewName).isEqualTo("redirect:/users");
        verify(redirectAttributes).addFlashAttribute(eq("successMessage"), anyString());
    }

    // POST /users/{id}/delete — Eliminar usuario

    @Test
    @DisplayName("deleteUser existente → redirige a /users con mensaje de éxito")
    void deleteUser_existente_debeRedirigirALista() {
        // Given
        doNothing().when(userService).deleteUser(1L);

        // When
        String viewName = controller.deleteUser(1L, redirectAttributes);

        // Then
        assertThat(viewName).isEqualTo("redirect:/users");
        verify(userService).deleteUser(1L);
        verify(redirectAttributes).addFlashAttribute(eq("successMessage"), anyString());
    }

    @Test
    @DisplayName("deleteUser inexistente → redirige a /users con mensaje de error")
    void deleteUser_inexistente_debeRedirigirConError() {
        // Given
        doThrow(new RuntimeException("User not found with id: 99"))
                .when(userService).deleteUser(99L);

        // When
        String viewName = controller.deleteUser(99L, redirectAttributes);

        // Then
        assertThat(viewName).isEqualTo("redirect:/users");
        verify(redirectAttributes).addFlashAttribute(eq("errorMessage"), contains("not found"));
    }
}
