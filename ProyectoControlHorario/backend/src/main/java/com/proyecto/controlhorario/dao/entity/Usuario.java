package com.proyecto.controlhorario.dao.entity;

public class Usuario {
    private String username;
    private String password;
    private String departamento;
    private String rol;

    public Usuario () {
    }

    public Usuario(String username, String password, String departamento, String rol) {
        this.username = username;
        this.password = password;
        this.departamento = departamento;
        this.rol = rol;
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
}


