package com.icesi.PhotoMarketApplication.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.icesi.PhotoMarketApplication.config.SecurityTestConfig;
import com.icesi.PhotoMarketApplication.controller.rest.UserRestController;
import com.icesi.PhotoMarketApplication.dto.UserCreateUpdateDTO;
import com.icesi.PhotoMarketApplication.dto.UserDTO;
import com.icesi.PhotoMarketApplication.entity.User;
import com.icesi.PhotoMarketApplication.mapper.UserMapper;
import com.icesi.PhotoMarketApplication.service.UserService;
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
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserRestController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest extends SecurityTestConfig {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private UserMapper userMapper;

    private User sampleUser;
    private UserDTO userDTO;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setUsername("apiuser");

        userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setUsername("apiuser");
    }

    @Test
    @DisplayName("POST /api/users - Returns 201 Created")
    void testCreateUser() throws Exception {
        UserCreateUpdateDTO dto = new UserCreateUpdateDTO();
        dto.setUsername("apiuser");
        dto.setRoleId(1L);

        given(userService.createUser(any(User.class), eq(1L))).willReturn(sampleUser);
        given(userMapper.entityToDto(sampleUser)).willReturn(userDTO);

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("apiuser"));
    }

    @Test
    @DisplayName("GET /api/users - Returns list of users")
    void testGetAllUsers() throws Exception {
        given(userService.getAllUsers()).willReturn(List.of(sampleUser));
        given(userMapper.entityToDto(sampleUser)).willReturn(userDTO);

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].username").value("apiuser"));
    }

    @Test
    @DisplayName("GET /api/users/{id} - Found (200 OK)")
    void testGetUserById_Found() throws Exception {
        given(userService.getUserById(1L)).willReturn(Optional.of(sampleUser));
        given(userMapper.entityToDto(sampleUser)).willReturn(userDTO);

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("apiuser"));
    }

    @Test
    @DisplayName("GET /api/users/{id} - Not Found (404)")
    void testGetUserById_NotFound() throws Exception {
        given(userService.getUserById(99L)).willReturn(Optional.empty());

        mockMvc.perform(get("/api/users/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PUT /api/users/{id} - Updates user (200 OK)")
    void testUpdateUser() throws Exception {
        UserCreateUpdateDTO dto = new UserCreateUpdateDTO();
        dto.setUsername("apiuser");

        given(userService.updateUser(eq(1L), any(User.class))).willReturn(sampleUser);
        given(userMapper.entityToDto(sampleUser)).willReturn(userDTO);

        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("apiuser"));
    }

    @Test
    @DisplayName("DELETE /api/users/{id} - Deletes user (204 No Content)")
    void testDeleteUser() throws Exception {
        willDoNothing().given(userService).deleteUser(1L);

        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());
    }
}
