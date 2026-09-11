package com.tincadena.app.controller;

import com.tincadena.app.entity.Role;
import com.tincadena.app.service.PermissionService;
import com.tincadena.app.service.RoleService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Set;

/**
 * MVC Controller para la gestión de Roles y sus Permisos.
 * Renderiza vistas Thymeleaf usando el layout de CUELLAR.
 * Consume los servicios CRUD de FELIPE.
 *
 * Contrato con CUELLAR (layout):
 *   th:replace="~{layout :: content}"
 */
@Controller
@RequestMapping("/roles")
public class RoleMvcController {

    private final RoleService roleService;
    private final PermissionService permissionService;

    public RoleMvcController(RoleService roleService, PermissionService permissionService) {
        this.roleService = roleService;
        this.permissionService = permissionService;
    }

    // ── GET /roles 
    // Lista todos los roles existentes con sus permisos asociados
    @GetMapping
    public String listRoles(Model model) {
        model.addAttribute("roles", roleService.getAllRoles());
        model.addAttribute("pageTitle", "Gestión de Roles");
        return "roles/list";
    }

    // ── GET /roles/new 
    // Formulario para crear un nuevo rol incluye selección de permisos
    @GetMapping("/new")
    public String showCreateForm(Model model) {
        model.addAttribute("role", new Role());
        model.addAttribute("allPermissions", permissionService.getAllPermissions());
        model.addAttribute("pageTitle", "Crear Rol");
        return "roles/form";
    }

    // ── POST /roles/new 
    // Procesa la creación del rol con sus permisos seleccionados
    @PostMapping("/new")
    public String createRole(@ModelAttribute Role role,
                             @RequestParam(required = false) Set<Long> permissionIds,
                             RedirectAttributes redirectAttributes) {
        try {
            roleService.createRole(role, permissionIds);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Rol '" + role.getName() + "' creado exitosamente.");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/roles/new";
        }
        return "redirect:/roles";
    }

    // ── GET /roles/{id}/permissions 
    // Vista para gestionar los permisos de un rol específico
    @GetMapping("/{id}/permissions")
    public String showPermissionsForm(@PathVariable Long id, Model model) {
        Role role = roleService.getRoleById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + id));
        model.addAttribute("role", role);
        model.addAttribute("allPermissions", permissionService.getAllPermissions());
        model.addAttribute("pageTitle", "Asociar Permisos al Rol: " + role.getName());
        return "roles/permissions";
    }

    // ── POST /roles/{roleId}/permissions/{permissionId}/add 
    // Agrega un permiso a un rol existente
    @PostMapping("/{roleId}/permissions/{permissionId}/add")
    public String addPermission(@PathVariable Long roleId,
                                @PathVariable Long permissionId,
                                RedirectAttributes redirectAttributes) {
        try {
            roleService.addPermissionToRole(roleId, permissionId);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Permiso agregado al rol correctamente.");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/roles/" + roleId + "/permissions";
    }

    // ── POST /roles/{roleId}/permissions/{permissionId}/remove 
    // Elimina un permiso de un rol valida que no sea el último
    @PostMapping("/{roleId}/permissions/{permissionId}/remove")
    public String removePermission(@PathVariable Long roleId,
                                   @PathVariable Long permissionId,
                                   RedirectAttributes redirectAttributes) {
        try {
            roleService.removePermissionFromRole(roleId, permissionId);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Permiso eliminado del rol correctamente.");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/roles/" + roleId + "/permissions";
    }

    // ── POST /roles/{id}/delete 
    // Elimina un rol del sistema
    @PostMapping("/{id}/delete")
    public String deleteRole(@PathVariable Long id,
                             RedirectAttributes redirectAttributes) {
        try {
            roleService.deleteRole(id);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Rol eliminado correctamente.");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/roles";
    }
}
