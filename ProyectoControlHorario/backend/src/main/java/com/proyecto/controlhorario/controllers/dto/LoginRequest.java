package com.proyecto.controlhorario.controllers.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    // Request DTO (lo que llega del frontend)

    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    private String username;

    @NotBlank(message = "La contraseña no puede estar vacía")
    private String password;

    private String recaptchaToken; // ✅ NUEVO

    public LoginRequest() {}

    public LoginRequest(String username, String password, String recaptchaToken) {
        this.username = username;
        this.password = password;
        this.recaptchaToken = recaptchaToken;
    }

    public String getRecaptchaToken() {
        return recaptchaToken;
    }

    public void setRecaptchaToken(String recaptchaToken) {
        this.recaptchaToken = recaptchaToken;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    
}


