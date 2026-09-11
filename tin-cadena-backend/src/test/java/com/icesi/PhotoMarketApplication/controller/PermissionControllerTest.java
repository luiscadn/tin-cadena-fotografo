package com.icesi.PhotoMarketApplication.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.icesi.PhotoMarketApplication.config.SecurityTestConfig;
import com.icesi.PhotoMarketApplication.controller.rest.PermissionRestController;
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
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests para PermissionRestController (/api/permissions).
 * Redirigido desde el antiguo PermissionController (vacío) al controlador REST real.
 */
@WebMvcTest(PermissionRestController.class)
@AutoConfigureMockMvc(addFilters = false)
class PermissionControllerTest extends SecurityTestConfig {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private PermissionService permissionService;

    @MockitoBean
    private PermissionMapper permissionMapper;

    private Permission samplePermission;
    private PermissionDTO permissionDTO;

    @BeforeEach
    void setUp() {
        samplePermission = new Permission();
        samplePermission.setId(1L);
        samplePermission.setName("API_READ");

        permissionDTO = new PermissionDTO();
        permissionDTO.setId(1L);
        permissionDTO.setName("API_READ");
    }

    @Test
    @DisplayName("POST /api/permissions - Creates permission (201 Created)")
    void testCreatePermission() throws Exception {
        given(permissionMapper.dtoToEntity(any(PermissionDTO.class))).willReturn(samplePermission);
        given(permissionService.createPermission(any(Permission.class))).willReturn(samplePermission);
        given(permissionMapper.entityToDto(samplePermission)).willReturn(permissionDTO);

        mockMvc.perform(post("/api/permissions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(permissionDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("API_READ"));
    }

    @Test
    @DisplayName("GET /api/permissions - Lists permissions")
    void testGetAllPermissions() throws Exception {
        given(permissionService.getAllPermissions()).willReturn(List.of(samplePermission));
        given(permissionMapper.entityToDto(samplePermission)).willReturn(permissionDTO);

        mockMvc.perform(get("/api/permissions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("API_READ"));
    }

    @Test
    @DisplayName("GET /api/permissions/{id} - Found (200 OK)")
    void testGetPermissionById_Found() throws Exception {
        given(permissionService.getPermissionById(1L)).willReturn(Optional.of(samplePermission));
        given(permissionMapper.entityToDto(samplePermission)).willReturn(permissionDTO);

        mockMvc.perform(get("/api/permissions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("API_READ"));
    }

    @Test
    @DisplayName("GET /api/permissions/{id} - Not Found (404)")
    void testGetPermissionById_NotFound() throws Exception {
        given(permissionService.getPermissionById(99L)).willReturn(Optional.empty());

        mockMvc.perform(get("/api/permissions/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/permissions/{id} - Deletes permission (204 No Content)")
    void testDeletePermission() throws Exception {
        willDoNothing().given(permissionService).deletePermission(1L);

        mockMvc.perform(delete("/api/permissions/1"))
                .andExpect(status().isNoContent());
    }
}
