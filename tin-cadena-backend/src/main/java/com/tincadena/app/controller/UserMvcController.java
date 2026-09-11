package com.tincadena.app.controller;

import com.tincadena.app.entity.User;
import com.tincadena.app.service.RoleService;
import com.tincadena.app.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * MVC Controller para la gestión de Usuarios.
 * Renderiza vistas Thymeleaf usando el layout de CUELLAR.
 * Consume los servicios CRUD de FELIPE.
 *
 * Contrato con CUELLAR (layout):
 *   th:replace="~{layout :: content}"
 *   El fragmento del contenido principal se llama "content".
 */
@Controller
@RequestMapping("/users")
public class UserMvcController {

    private final UserService userService;
    private final RoleService roleService;

    public UserMvcController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    // ── GET /users 
    // Lista todos los usuarios registrados en el sistema
    @GetMapping
    public String listUsers(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("pageTitle", "Gestión de Usuarios");
        return "users/list";
    }

    // ── GET /users/new 
    // Muestra el formulario de registro de un nuevo usuario
    @GetMapping("/new")
    public String showCreateForm(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.getAllRoles());
        model.addAttribute("pageTitle", "Registrar Usuario");
        return "users/form";
    }

    // ── POST /users/new 
    // Procesa el formulario de creación de usuario
    @PostMapping("/new")
    public String createUser(@ModelAttribute User user,
                             @RequestParam Long roleId,
                             RedirectAttributes redirectAttributes) {
        try {
            userService.createUser(user, roleId);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Usuario '" + user.getUsername() + "' creado exitosamente.");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/users/new";
        }
        return "redirect:/users";
    }

    // ── GET /users/{id}/assign-role 
    // Formulario para cambiar / asignar rol a un usuario existente
    @GetMapping("/{id}/assign-role")
    public String showAssignRoleForm(@PathVariable Long id, Model model) {
        User user = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + id));
        model.addAttribute("user", user);
        model.addAttribute("roles", roleService.getAllRoles());
        model.addAttribute("pageTitle", "Asignar Rol a Usuario");
        return "users/assign-role";
    }

    // ── POST /users/{id}/assign-role 
    // Aplica el cambio de rol al usuario
    @PostMapping("/{id}/assign-role")
    public String assignRole(@PathVariable Long id,
                             @RequestParam Long roleId,
                             RedirectAttributes redirectAttributes) {
        try {
            userService.changeUserRole(id, roleId);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Rol actualizado correctamente.");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/users";
    }

    // ── POST /users/{id}/delete 
    // Elimina un usuario POST para compatibilidad HTML forms
    @PostMapping("/{id}/delete")
    public String deleteUser(@PathVariable Long id,
                             RedirectAttributes redirectAttributes) {
        try {
            userService.deleteUser(id);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Usuario eliminado correctamente.");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/users";
    }
}
