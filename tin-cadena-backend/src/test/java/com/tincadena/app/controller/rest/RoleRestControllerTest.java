package com.tincadena.app.controller.rest;

import com.tincadena.app.dto.RoleDTO;
import com.tincadena.app.entity.Permission;
import com.tincadena.app.entity.Role;
import com.tincadena.app.mapper.RoleMapper;
import com.tincadena.app.security.JwtAuthenticationFilter;
import com.tincadena.app.service.RoleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RoleRestController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("RoleRestController - Pruebas Unitarias")
class RoleRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private RoleService roleService;

    @MockBean
    private RoleMapper roleMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private Role sampleRole;
    private RoleDTO sampleRoleDTO;

    @BeforeEach
    void setUp() {
        Permission perm1 = new Permission();
        perm1.setId(1L);
        perm1.setName("READ");

        Permission perm2 = new Permission();
        perm2.setId(2L);
        perm2.setName("WRITE");

        Set<Permission> permissions = new HashSet<>();
        permissions.add(perm1);
        permissions.add(perm2);

        sampleRole = new Role();
        sampleRole.setId(1L);
        sampleRole.setName("ADMIN");
        sampleRole.setPermissions(permissions);

        Set<Long> permissionIds = new HashSet<>();
        permissionIds.add(1L);
        permissionIds.add(2L);

        Set<String> permissionNames = new HashSet<>();
        permissionNames.add("READ");
        permissionNames.add("WRITE");

        sampleRoleDTO = new RoleDTO(1L, "ADMIN", permissionIds, permissionNames);
    }

    @Test
    @DisplayName("POST /api/roles - Crear rol exitoso retorna 201 CREATED")
    void createRole_exitoso_retorna201() throws Exception {
        Set<Long> permissionIds = new HashSet<>();
        permissionIds.add(1L);
        permissionIds.add(2L);
        RoleDTO createDTO = new RoleDTO(null, "ADMIN", permissionIds, null);

        // CORRECCIÓN: eq(permissionIds) reemplazado por any(Set.class)
        // El Set deserializado del JSON es una nueva instancia distinta, eq() falla por referencia
        when(roleService.createRole(any(Role.class), any(Set.class))).thenReturn(sampleRole);
        when(roleMapper.entityToDto(sampleRole)).thenReturn(sampleRoleDTO);

        mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("ADMIN"));
    }

    @Test
    @DisplayName("GET /api/roles - Listar todos los roles retorna 200 OK")
    void getAll_retorna200YLista() throws Exception {
        when(roleService.getAllRoles()).thenReturn(List.of(sampleRole));
        when(roleMapper.entityToDto(sampleRole)).thenReturn(sampleRoleDTO);

        mockMvc.perform(get("/api/roles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("ADMIN"));
    }

    @Test
    @DisplayName("GET /api/roles/{id} - Obtener rol existente retorna 200 OK")
    void getById_existente_retorna200() throws Exception {
        when(roleService.getRoleById(1L)).thenReturn(Optional.of(sampleRole));
        when(roleMapper.entityToDto(sampleRole)).thenReturn(sampleRoleDTO);

        mockMvc.perform(get("/api/roles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("ADMIN"));
    }

    @Test
    @DisplayName("GET /api/roles/{id} - Obtener rol inexistente retorna 404 NOT FOUND")
    void getById_inexistente_retorna404() throws Exception {
        when(roleService.getRoleById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/roles/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PUT /api/roles/{id} - Actualizar rol retorna 200 OK")
    void update_retorna200() throws Exception {
        Set<Long> permissionIds = new HashSet<>();
        permissionIds.add(1L);
        RoleDTO updateDTO = new RoleDTO(null, "SUPER_ADMIN", permissionIds, null);

        Role updatedRole = new Role();
        updatedRole.setId(1L);
        updatedRole.setName("SUPER_ADMIN");

        Set<String> permNames = new HashSet<>();
        permNames.add("READ");
        RoleDTO updatedDTO = new RoleDTO(1L, "SUPER_ADMIN", permissionIds, permNames);

        // CORRECCIÓN: eq(permissionIds) reemplazado por any(Set.class) por la misma razón
        when(roleService.updateRole(eq(1L), any(Role.class), any(Set.class))).thenReturn(updatedRole);
        when(roleMapper.entityToDto(updatedRole)).thenReturn(updatedDTO);

        mockMvc.perform(put("/api/roles/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("SUPER_ADMIN"));
    }

    @Test
    @DisplayName("DELETE /api/roles/{id} - Eliminar rol existente retorna 204 NO CONTENT")
    void delete_existente_retorna204() throws Exception {
        doNothing().when(roleService).deleteRole(1L);

        mockMvc.perform(delete("/api/roles/1"))
                .andExpect(status().isNoContent());
    }
}