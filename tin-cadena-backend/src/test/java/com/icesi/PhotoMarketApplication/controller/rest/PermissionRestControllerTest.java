package com.icesi.PhotoMarketApplication.controller.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.icesi.PhotoMarketApplication.config.SecurityTestConfig;
import com.icesi.PhotoMarketApplication.dto.PermissionDTO;
import com.icesi.PhotoMarketApplication.entity.Permission;
import com.icesi.PhotoMarketApplication.mapper.PermissionMapper;
import com.icesi.PhotoMarketApplication.service.PermissionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PermissionRestController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("PermissionRestController - Pruebas Unitarias")
class PermissionRestControllerTest extends SecurityTestConfig {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PermissionService permissionService;

    @MockitoBean
    private PermissionMapper permissionMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private Permission samplePermission;
    private PermissionDTO samplePermissionDTO;

    @BeforeEach
    void setUp() {
        samplePermission = new Permission();
        samplePermission.setId(1L);
        samplePermission.setName("READ");

        samplePermissionDTO = new PermissionDTO(1L, "READ");
    }

    @Test
    @DisplayName("POST /api/permissions - Crear permiso exitoso retorna 201 CREATED")
    void create_exitoso_retorna201() throws Exception {
        PermissionDTO createDTO = new PermissionDTO(null, "READ");

        when(permissionMapper.dtoToEntity(any(PermissionDTO.class))).thenReturn(samplePermission);
        when(permissionService.createPermission(any(Permission.class))).thenReturn(samplePermission);
        when(permissionMapper.entityToDto(samplePermission)).thenReturn(samplePermissionDTO);

        mockMvc.perform(post("/api/permissions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("READ"));
    }

    @Test
    @DisplayName("GET /api/permissions - Listar todos los permisos retorna 200 OK")
    void getAll_retorna200YLista() throws Exception {
        when(permissionService.getAllPermissions()).thenReturn(List.of(samplePermission));
        when(permissionMapper.entityToDto(samplePermission)).thenReturn(samplePermissionDTO);

        mockMvc.perform(get("/api/permissions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("READ"));
    }

    @Test
    @DisplayName("GET /api/permissions/{id} - Obtener permiso existente retorna 200 OK")
    void getById_existente_retorna200() throws Exception {
        when(permissionService.getPermissionById(1L)).thenReturn(Optional.of(samplePermission));
        when(permissionMapper.entityToDto(samplePermission)).thenReturn(samplePermissionDTO);

        mockMvc.perform(get("/api/permissions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("READ"));
    }

    @Test
    @DisplayName("GET /api/permissions/{id} - Obtener permiso inexistente retorna 404 NOT FOUND")
    void getById_inexistente_retorna404() throws Exception {
        when(permissionService.getPermissionById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/permissions/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/permissions/{id} - Eliminar permiso existente retorna 204 NO CONTENT")
    void delete_existente_retorna204() throws Exception {
        doNothing().when(permissionService).deletePermission(1L);

        mockMvc.perform(delete("/api/permissions/1"))
                .andExpect(status().isNoContent());
    }
}