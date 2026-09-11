package com.tincadena.app.controller;

import com.tincadena.app.config.SecurityTestConfig;
import com.tincadena.app.dto.RegisterRequest;
import com.tincadena.app.entity.Role;
import com.tincadena.app.security.SecurityConfig;
import com.tincadena.app.service.AuthenticationService;
import com.tincadena.app.service.RoleService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.List;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthMvcController.class)
@Import(SecurityConfig.class)
@WithMockUser
class AuthMvcControllerTest extends SecurityTestConfig {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthenticationService authenticationService;

    @MockitoBean
    private RoleService roleService;

    private Role sampleRole;

    @BeforeEach
    void setUp() {
        sampleRole = new Role();
        sampleRole.setId(1L);
        sampleRole.setName("USER");
    }

    @Test
    @DisplayName("GET /login - Happy Path")
    void testLoginPage() throws Exception {
        mockMvc.perform(get("/login"))
                .andExpect(status().isOk())
                .andExpect(view().name("login"))
                .andExpect(model().attributeExists("pageTitle"))
                .andExpect(model().attributeDoesNotExist("error"))
                .andExpect(model().attributeDoesNotExist("message"));
    }

    @Test
    @DisplayName("GET /login?error=true - Edge Case")
    void testLoginPage_WithError() throws Exception {
        mockMvc.perform(get("/login").param("error", "true"))
                .andExpect(status().isOk())
                .andExpect(view().name("login"))
                .andExpect(model().attributeExists("error"));
    }

    @Test
    @DisplayName("GET /login?logout=true - Edge Case")
    void testLoginPage_WithLogout() throws Exception {
        mockMvc.perform(get("/login").param("logout", "true"))
                .andExpect(status().isOk())
                .andExpect(view().name("login"))
                .andExpect(model().attributeExists("message"));
    }

    @Test
    @DisplayName("GET /register - Happy Path")
    void testRegisterPage() throws Exception {
        given(roleService.getAllRoles()).willReturn(List.of(sampleRole));

        mockMvc.perform(get("/register"))
                .andExpect(status().isOk())
                .andExpect(view().name("register"))
                .andExpect(model().attributeExists("registerRequest"))
                .andExpect(model().attributeExists("roles"));
    }

    @Test
    @DisplayName("POST /register - Happy Path: Success Registration")
    void testRegister_Success() throws Exception {
        // Mock successful registration
        given(authenticationService.register(any(RegisterRequest.class))).willReturn(null);

        mockMvc.perform(post("/register")
                        .with(csrf())
                        .param("username", "newuser")
                        .param("password", "strongpassword")
                        .param("name", "New User")
                        .param("email", "newuser@test.com")
                        .param("roleId", "1"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login"))
                .andExpect(flash().attributeExists("successMessage"));
    }

    @Test
    @DisplayName("POST /register - Edge Case: Binding Error (Invalid Request)")
    void testRegister_BindingError() throws Exception {
        given(roleService.getAllRoles()).willReturn(List.of(sampleRole));

        // Submit empty form to trigger @Valid blank validations
        mockMvc.perform(post("/register").with(csrf()))
                .andExpect(status().isOk()) // returns the form with errors
                .andExpect(view().name("register"))
                .andExpect(model().attributeExists("roles"))
                .andExpect(model().hasErrors());
    }

    @Test
    @DisplayName("POST /register - Edge Case: RuntimeException from Service")
    void testRegister_ServiceError() throws Exception {
        given(roleService.getAllRoles()).willReturn(List.of(sampleRole));
        willThrow(new RuntimeException("Username already in use"))
                .given(authenticationService).register(any(RegisterRequest.class));

        mockMvc.perform(post("/register")
                        .with(csrf())
                        .param("username", "dupuser")
                        .param("password", "strongpassword")
                        .param("name", "Dup User")
                        .param("email", "dupuser@test.com"))
                .andExpect(status().isOk())
                .andExpect(view().name("register"))
                .andExpect(model().attributeExists("errorMessage"));
    }

    @Test
    @DisplayName("GET /access-denied - Happy Path")
    void testAccessDenied() throws Exception {
        mockMvc.perform(get("/access-denied"))
                .andExpect(status().isOk())
                .andExpect(view().name("access-denied"))
                .andExpect(model().attributeExists("pageTitle"));
    }
}
