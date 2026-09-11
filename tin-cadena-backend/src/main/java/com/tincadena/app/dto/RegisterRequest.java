package com.tincadena.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para solicitud de registro de usuario
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String firstName;
    private String lastName;

    private String name;

    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    private String username;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    @Email(message = "El correo electronico debe ser valido")
    private String email;

    private Long roleId;

    public String getName() {
        if (name != null && !name.trim().isEmpty()) {
            return name.trim();
        }
        if (firstName != null || lastName != null) {
            String combined = ((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "")).trim();
            if (!combined.isEmpty()) {
                return combined;
            }
        }
        return username != null ? username : "Usuario";
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
        syncName();
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
        syncName();
    }

    private void syncName() {
        if (this.name == null || this.name.trim().isEmpty()) {
            String combined = ((this.firstName != null ? this.firstName : "") + " " + (this.lastName != null ? this.lastName : "")).trim();
            if (!combined.isEmpty()) {
                this.name = combined;
            }
        }
    }
}