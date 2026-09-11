package com.icesi.PhotoMarketApplication.controller.rest;

import com.icesi.PhotoMarketApplication.dto.UserCreateUpdateDTO;
import com.icesi.PhotoMarketApplication.dto.UserDTO;
import com.icesi.PhotoMarketApplication.entity.Role;
import com.icesi.PhotoMarketApplication.entity.User;
import com.icesi.PhotoMarketApplication.mapper.UserMapper;
import com.icesi.PhotoMarketApplication.security.JwtAuthenticationFilter;
import com.icesi.PhotoMarketApplication.service.UserService;
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

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserRestController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("UserRestController - Pruebas Unitarias")
class UserRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private UserService userService;

    @MockBean
    private UserMapper userMapper;

    private User sampleUser;
    private UserDTO sampleUserDTO;
    private Role roleAdmin;

    @BeforeEach
    void setUp() {
        roleAdmin = new Role();
        roleAdmin.setId(1L);
        roleAdmin.setName("ADMIN");

        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setName("Juan Pérez");
        sampleUser.setUsername("juanp");
        sampleUser.setPassword("pass123");
        sampleUser.setEmail("juan@test.com");
        sampleUser.setRole(roleAdmin);

        sampleUserDTO = new UserDTO(1L, "Juan Pérez", "juanp", "juan@test.com", "ADMIN");
    }

    @Test
    @DisplayName("POST /api/users - Crear usuario exitoso retorna 201 CREATED")
    void createUser_exitoso_retorna201() throws Exception {
        UserCreateUpdateDTO createDTO = new UserCreateUpdateDTO("Juan Pérez", "juanp", "pass123", "juan@test.com", 1L);

        when(userService.createUser(any(User.class), eq(1L))).thenReturn(sampleUser);
        when(userMapper.entityToDto(sampleUser)).thenReturn(sampleUserDTO);

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Juan Pérez"))
                .andExpect(jsonPath("$.username").value("juanp"))
                .andExpect(jsonPath("$.email").value("juan@test.com"))
                .andExpect(jsonPath("$.roleName").value("ADMIN"));
    }

    @Test
    @DisplayName("GET /api/users - Listar todos los usuarios retorna 200 OK")
    void getAllUsers_retorna200YLista() throws Exception {
        when(userService.getAllUsers()).thenReturn(List.of(sampleUser));
        when(userMapper.entityToDto(sampleUser)).thenReturn(sampleUserDTO);

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("Juan Pérez"))
                .andExpect(jsonPath("$[0].username").value("juanp"));
    }

    @Test
    @DisplayName("GET /api/users/{id} - Obtener usuario existente retorna 200 OK")
    void getUserById_existente_retorna200() throws Exception {
        when(userService.getUserById(1L)).thenReturn(Optional.of(sampleUser));
        when(userMapper.entityToDto(sampleUser)).thenReturn(sampleUserDTO);

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Juan Pérez"));
    }

    @Test
    @DisplayName("GET /api/users/{id} - Obtener usuario inexistente retorna 404 NOT FOUND")
    void getUserById_inexistente_retorna404() throws Exception {
        when(userService.getUserById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PUT /api/users/{id} - Actualizar usuario retorna 200 OK")
    void updateUser_retorna200() throws Exception {
        UserCreateUpdateDTO updateDTO = new UserCreateUpdateDTO("Juan Actualizado", "juanp", "newpass", "juan@test.com", 1L);
        User updatedUser = new User();
        updatedUser.setId(1L);
        updatedUser.setName("Juan Actualizado");
        updatedUser.setUsername("juanp");
        updatedUser.setEmail("juan@test.com");
        updatedUser.setRole(roleAdmin);

        UserDTO updatedDTO = new UserDTO(1L, "Juan Actualizado", "juanp", "juan@test.com", "ADMIN");

        when(userService.updateUser(eq(1L), any(User.class))).thenReturn(updatedUser);
        when(userMapper.entityToDto(updatedUser)).thenReturn(updatedDTO);

        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Juan Actualizado"));
    }

    @Test
    @DisplayName("DELETE /api/users/{id} - Eliminar usuario existente retorna 204 NO CONTENT")
    void deleteUser_existente_retorna204() throws Exception {
        doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());
    }
}