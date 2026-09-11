package com.icesi.PhotoMarketApplication.controller.rest;

import java.util.List;
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

import com.icesi.PhotoMarketApplication.dto.PermissionDTO;
import com.icesi.PhotoMarketApplication.entity.Permission;
import com.icesi.PhotoMarketApplication.mapper.PermissionMapper;
import com.icesi.PhotoMarketApplication.service.PermissionService;

@RestController
@RequestMapping("/api/permissions")
public class PermissionRestController {

    private final PermissionService permissionService;
    private final PermissionMapper permissionMapper;

    public PermissionRestController(PermissionService permissionService, PermissionMapper permissionMapper) {
        this.permissionService = permissionService;
        this.permissionMapper = permissionMapper;
    }

    @PostMapping
    public ResponseEntity<PermissionDTO> create(@RequestBody PermissionDTO dto) {
        Permission created = permissionService.createPermission(permissionMapper.dtoToEntity(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(permissionMapper.entityToDto(created));
    }

    @GetMapping
    public ResponseEntity<List<PermissionDTO>> getAll() {
        List<PermissionDTO> permissions = permissionService.getAllPermissions().stream()
                .map(permissionMapper::entityToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(permissions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PermissionDTO> getById(@PathVariable Long id) {
        return permissionService.getPermissionById(id)
                .map(permissionMapper::entityToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PermissionDTO> update(@PathVariable Long id, @RequestBody PermissionDTO dto) {
        Permission updated = permissionMapper.dtoToEntity(dto);
        Permission result = permissionService.updatePermission(id, updated);
        return ResponseEntity.ok(permissionMapper.entityToDto(result));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        permissionService.deletePermission(id);
        return ResponseEntity.noContent().build();
    }
}
