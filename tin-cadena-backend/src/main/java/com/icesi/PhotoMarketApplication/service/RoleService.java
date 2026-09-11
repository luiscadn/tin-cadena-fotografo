package com.icesi.PhotoMarketApplication.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesi.PhotoMarketApplication.entity.Permission;
import com.icesi.PhotoMarketApplication.entity.Role;
import com.icesi.PhotoMarketApplication.repository.PermissionRepository;
import com.icesi.PhotoMarketApplication.repository.RoleRepository;

@Service
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public RoleService(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    /**
     * Crear un nuevo rol
     * REGLA: Un rol DEBE tener al menos un permiso
     */
    @Transactional
    public Role createRole(Role role, Set<Long> permissionIds) {
        
        // Validar que el rol tenga permisos (regla del taller)
        if (permissionIds == null || permissionIds.isEmpty()) {
            throw new RuntimeException("Role must have at least one permission");
        }
        
        // Validar nombre único
        if (roleRepository.existsByName(role.getName())) {
            throw new RuntimeException("Role name already exists: " + role.getName());
        }
        
        // Obtener los permisos
        List<Permission> permissionList = permissionRepository.findAllById(permissionIds);
        Set<Permission> permissions = new HashSet<>(permissionList);
        
        if (permissions.isEmpty()) {
            throw new RuntimeException("No valid permissions found");
        }
        
        role.setPermissions(permissions);
        return roleRepository.save(role);
    }

    /**
     * Obtener todos los roles
     */
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    /**
     * Obtener rol por ID
     */
    public Optional<Role> getRoleById(Long id) {
        return roleRepository.findById(id);
    }

    /**
     * Obtener rol por nombre
     */
    public Optional<Role> getRoleByName(String name) {
        return roleRepository.findByName(name);
    }

    /**
     * Agregar permiso a un rol
     */
    @Transactional
    public Role addPermissionToRole(Long roleId, Long permissionId) {
        
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Permission not found"));
        
        role.getPermissions().add(permission);
        return roleRepository.save(role);
    }

    /**
     * Eliminar permiso de un rol
     */
    @Transactional
    public Role removePermissionFromRole(Long roleId, Long permissionId) {
        
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Permission not found"));
        
        // Validar que el rol no se quede sin permisos
        if (role.getPermissions().size() <= 1) {
            throw new RuntimeException("Cannot remove last permission from role");
        }
        
        role.getPermissions().remove(permission);
        return roleRepository.save(role);
    }

    @Transactional
    public Role updateRole(Long id, Role updated, Set<Long> permissionIds) {

        Role existing = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));

        if (updated.getName() != null && !updated.getName().equals(existing.getName())) {
            if (roleRepository.existsByName(updated.getName())) {
                throw new RuntimeException("Role name already exists: " + updated.getName());
            }
            existing.setName(updated.getName());
        }

        if (permissionIds != null) {
            if (permissionIds.isEmpty()) {
                throw new RuntimeException("Role must have at least one permission");
            }
            List<Permission> permissionList = permissionRepository.findAllById(permissionIds);
            Set<Permission> permissions = new HashSet<>(permissionList);
            if (permissions.isEmpty()) {
                throw new RuntimeException("No valid permissions found");
            }
            existing.setPermissions(permissions);
        }

        return roleRepository.save(existing);
    }

    /**
     * Eliminar rol
     */
    @Transactional
    public void deleteRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new RuntimeException("Role not found with id: " + id);
        }
        roleRepository.deleteById(id);
    }
}