package com.icesi.PhotoMarketApplication.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import com.icesi.PhotoMarketApplication.config.SecurityTestConfig;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DashboardController.class)
class DashboardControllerTest extends SecurityTestConfig {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "adminUser", authorities = {"ROLE_ADMIN"})
    @DisplayName("GET / - Redirect ROLE_ADMIN to /users")
    void testDashboard_AdminRole() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/users"));
    }

    @Test
    @WithMockUser(username = "photoUser", authorities = {"ROLE_PHOTOGRAPHER"})
    @DisplayName("GET / - Redirect ROLE_PHOTOGRAPHER to /photographer/dashboard")
    void testDashboard_PhotographerRole() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/photographer/dashboard"));
    }

    @Test
    @WithMockUser(username = "buyerUser", authorities = {"ROLE_BUYER"})
    @DisplayName("GET / - Redirect ROLE_BUYER to /buyer/dashboard")
    void testDashboard_BuyerRole() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/buyer/dashboard"));
    }

    @Test
    @WithMockUser(username = "unknownUser", authorities = {"ROLE_UNKNOWN"})
    @DisplayName("GET / - Redirect DEFAULT to /user/dashboard")
    void testDashboard_DefaultRole() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/user/dashboard"));
    }

    @Test
    @WithMockUser(username = "photoUser")
    @DisplayName("GET /photographer/dashboard - Returns photographer view")
    void testPhotographerDashboard() throws Exception {
        mockMvc.perform(get("/photographer/dashboard"))
                .andExpect(status().isOk())
                .andExpect(view().name("dashboard/photographer"))
                .andExpect(model().attributeExists("username", "pageTitle"));
    }

    @Test
    @WithMockUser(username = "buyerUser")
    @DisplayName("GET /buyer/dashboard - Returns buyer view")
    void testBuyerDashboard() throws Exception {
        mockMvc.perform(get("/buyer/dashboard"))
                .andExpect(status().isOk())
                .andExpect(view().name("dashboard/buyer"))
                .andExpect(model().attributeExists("username", "pageTitle"));
    }

    @Test
    @WithMockUser(username = "testUser")
    @DisplayName("GET /user/dashboard - Returns standard user view")
    void testUserDashboard() throws Exception {
        mockMvc.perform(get("/user/dashboard"))
                .andExpect(status().isOk())
                .andExpect(view().name("dashboard/user"))
                .andExpect(model().attributeExists("username", "pageTitle"));
    }
}
