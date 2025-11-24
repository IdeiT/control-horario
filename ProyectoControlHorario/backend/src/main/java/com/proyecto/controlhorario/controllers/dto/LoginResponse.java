package com.proyecto.controlhorario.controllers.dto;


public class LoginResponse {
    // Response DTO (lo que devuelves al frontend)

    private String username;
    private String token;
    private String mensaje;

    public LoginResponse(String msg) {   
        this.mensaje = msg;
    }

    public LoginResponse(String username, String token, String mensaje) {
        this.username = username;
        this.token = token;
        this.mensaje = mensaje;
    }

    public String getUsername() {
        return username;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}


