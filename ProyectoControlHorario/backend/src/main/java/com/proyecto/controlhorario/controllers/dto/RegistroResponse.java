package com.proyecto.controlhorario.controllers.dto;
import com.proyecto.controlhorario.dao.entity.Usuario;


public class RegistroResponse {
    // Response DTO (lo que devuelves al frontend)

    private String username;
    private String departamento;
    private String rol;

    private String msg;  // Mensaje adicional

    public RegistroResponse(String msg) {   
        this.msg = msg;
    }
    
    // Constructor desde Entity
    public RegistroResponse(Usuario usuario) {
        this.username = usuario.getUsername();
        this.departamento = usuario.getDepartamento();
        this.rol = usuario.getRol();
    }
    
    // Getters y Setters
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getDepartamento() {
        return departamento;
    }
    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }
    public String getRol() {
        return rol;
    }
    public void setRol(String rol) {
        this.rol = rol;
    }
    public String getMsg() {
        return msg;
    }
    public void setMsg(String msg) {
        this.msg = msg;
    }
}