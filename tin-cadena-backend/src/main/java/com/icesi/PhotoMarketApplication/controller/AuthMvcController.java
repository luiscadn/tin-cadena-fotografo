package com.icesi.PhotoMarketApplication.controller;

import com.icesi.PhotoMarketApplication.dto.RegisterRequest;
import com.icesi.PhotoMarketApplication.entity.Role;
import com.icesi.PhotoMarketApplication.service.AuthenticationService;
import com.icesi.PhotoMarketApplication.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping
public class AuthMvcController {

    private final AuthenticationService authenticationService;
    private final RoleService roleService;

    public AuthMvcController(AuthenticationService authenticationService, RoleService roleService) {
        this.authenticationService = authenticationService;
        this.roleService = roleService;
    }

    @GetMapping("/login")
    public String loginPage(@RequestParam(value = "error", required = false) String error,
                           @RequestParam(value = "logout", required = false) String logout,
                           Model model) {
        model.addAttribute("pageTitle", "Iniciar sesión");
        
        if (error != null) {
            model.addAttribute("error", "Credenciales inválidas. Por favor intenta nuevamente.");
        }
        
        if (logout != null) {
            model.addAttribute("message", "Has cerrado sesión correctamente.");
        }
        
        return "login";
    }

    @GetMapping("/register")
    public String registerPage(Model model) {
        List<Role> roles = roleService.getAllRoles();
        model.addAttribute("registerRequest", new RegisterRequest());
        model.addAttribute("roles", roles);
        model.addAttribute("pageTitle", "Registro");
        return "register";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("registerRequest") RegisterRequest request,
                           BindingResult bindingResult,
                           Model model,
                           RedirectAttributes redirectAttributes) {

        if (bindingResult.hasErrors()) {
            model.addAttribute("roles", roleService.getAllRoles());
            model.addAttribute("pageTitle", "Registro");
            return "register";
        }

        try {
            authenticationService.register(request);
            redirectAttributes.addFlashAttribute("successMessage", "Registro exitoso. Ahora puedes iniciar sesión.");
            return "redirect:/login";
        } catch (RuntimeException e) {
            model.addAttribute("roles", roleService.getAllRoles());
            model.addAttribute("pageTitle", "Registro");
            model.addAttribute("errorMessage", e.getMessage());
            return "register";
        }
    }

    @GetMapping("/access-denied")
    public String accessDenied(Model model) {
        model.addAttribute("pageTitle", "Acceso denegado");
        return "access-denied";
    }
}
