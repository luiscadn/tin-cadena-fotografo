package com.icesi.PhotoMarketApplication.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controlador para vistas diferenciadas por rol
 */
@Controller
public class DashboardController {

    /**
     * Dashboard principal - redirige según rol del usuario
     */
    @GetMapping("/")
    public String dashboard(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String role = auth.getAuthorities().iterator().next().getAuthority();
        
        model.addAttribute("username", auth.getName());
        model.addAttribute("userRole", role);
        
        // Redirigir según el rol
        switch (role) {
            case "ROLE_ADMIN":
                return "redirect:/users";
            case "ROLE_PHOTOGRAPHER":
                return "redirect:/photographer/dashboard";
            case "ROLE_BUYER":
                return "redirect:/buyer/dashboard";
            default:
                return "redirect:/user/dashboard";
        }
    }

    /**
     * Dashboard para fotógrafos
     */
    @GetMapping("/photographer/dashboard")
    public String photographerDashboard(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        model.addAttribute("username", auth.getName());
        model.addAttribute("pageTitle", "Panel Fotógrafo");
        return "dashboard/photographer";
    }

    /**
     * Dashboard para compradores
     */
    @GetMapping("/buyer/dashboard")
    public String buyerDashboard(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        model.addAttribute("username", auth.getName());
        model.addAttribute("pageTitle", "Panel Comprador");
        return "dashboard/buyer";
    }

    /**
     * Dashboard para usuarios genéricos
     */
    @GetMapping("/user/dashboard")
    public String userDashboard(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        model.addAttribute("username", auth.getName());
        model.addAttribute("pageTitle", "Mi Panel");
        return "dashboard/user";
    }
}
