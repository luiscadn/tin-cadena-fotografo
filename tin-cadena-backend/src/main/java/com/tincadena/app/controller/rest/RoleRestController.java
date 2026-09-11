package com.tincadena.app.controller.rest;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tincadena.app.dto.RoleDTO;
import com.tincadena.app.entity.Role;
import com.tincadena.app.mapper.RoleMapper;
import com.tincadena.app.service.RoleService;

@RestController
@RequestMapping("/api/roles")
public class RoleRestController {

    private final RoleService roleService;
    private final RoleMapper roleMapper;

    public RoleRestController(RoleService roleService, RoleMapper roleMapper) {
        this.roleService = roleService;
        this.roleMapper = roleMapper;
    }

    @PostMapping
    public ResponseEntity<RoleDTO> createRole(@RequestBody RoleDTO dto) {
        Set<Long> permissionIds = dto.getPermissionIds();

        Role role = new Role();
        role.setName(dto.getName());

        Role created = roleService.createRole(role, permissionIds);
        return ResponseEntity.status(HttpStatus.CREATED).body(roleMapper.entityToDto(created));
    }

    @GetMapping
    public ResponseEntity<List<RoleDTO>> getAll() {
        List<RoleDTO> roles = roleService.getAllRoles().stream()
                .map(roleMapper::entityToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleDTO> getById(@PathVariable Long id) {
        return roleService.getRoleById(id)
                .map(roleMapper::entityToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleDTO> update(@PathVariable Long id, @RequestBody RoleDTO dto) {
        Role updated = new Role();
        updated.setName(dto.getName());

        Role result = roleService.updateRole(id, updated, dto.getPermissionIds());
        return ResponseEntity.ok(roleMapper.entityToDto(result));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }
}
