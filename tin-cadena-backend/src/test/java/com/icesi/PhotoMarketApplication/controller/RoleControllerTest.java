package com.icesi.PhotoMarketApplication.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.icesi.PhotoMarketApplication.config.SecurityTestConfig;
import com.icesi.PhotoMarketApplication.controller.rest.RoleRestController;
import com.icesi.PhotoMarketApplication.dto.RoleDTO;
import com.icesi.PhotoMarketApplication.entity.Role;
import com.icesi.PhotoMarketApplication.mapper.RoleMapper;
import com.icesi.PhotoMarketApplication.service.RoleService;
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
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests para RoleRestController (/api/roles).
 * Redirigido desde el antiguo RoleController (vacío) al controlador REST real.
 */
@WebMvcTest(RoleRestController.class)
@AutoConfigureMockMvc(addFilters = false)
class RoleControllerTest extends SecurityTestConfig {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private RoleService roleService;

    @MockitoBean
    private RoleMapper roleMapper;

    private Role sampleRole;
    private RoleDTO roleDTO;

    @BeforeEach
    void setUp() {
        sampleRole = new Role();
        sampleRole.setId(1L);
        sampleRole.setName("API_ROLE");

        roleDTO = new RoleDTO();
        roleDTO.setId(1L);
        roleDTO.setName("API_ROLE");
        roleDTO.setPermissionIds(Set.of(1L, 2L));
    }

    @Test
    @DisplayName("POST /api/roles - Creates Role (201 Created)")
    void testCreateRole() throws Exception {
        given(roleService.createRole(any(Role.class), any(Set.class))).willReturn(sampleRole);
        given(roleMapper.entityToDto(sampleRole)).willReturn(roleDTO);

        mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roleDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("API_ROLE"));
    }

    @Test
    @DisplayName("GET /api/roles - Returns roles list")
    void testGetAllRoles() throws Exception {
        given(roleService.getAllRoles()).willReturn(List.of(sampleRole));
        given(roleMapper.entityToDto(sampleRole)).willReturn(roleDTO);

        mockMvc.perform(get("/api/roles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("API_ROLE"));
    }

    @Test
    @DisplayName("GET /api/roles/{id} - Found (200 OK)")
    void testGetRoleById_Found() throws Exception {
        given(roleService.getRoleById(1L)).willReturn(Optional.of(sampleRole));
        given(roleMapper.entityToDto(sampleRole)).willReturn(roleDTO);

        mockMvc.perform(get("/api/roles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("API_ROLE"));
    }

    @Test
    @DisplayName("GET /api/roles/{id} - Not Found (404)")
    void testGetRoleById_NotFound() throws Exception {
        given(roleService.getRoleById(99L)).willReturn(Optional.empty());

        mockMvc.perform(get("/api/roles/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/roles/{id} - Deletes role (204 No Content)")
    void testDeleteRole() throws Exception {
        willDoNothing().given(roleService).deleteRole(1L);

        mockMvc.perform(delete("/api/roles/1"))
                .andExpect(status().isNoContent());
    }
}
