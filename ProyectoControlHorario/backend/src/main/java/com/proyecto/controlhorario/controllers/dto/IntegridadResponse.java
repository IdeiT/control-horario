package com.proyecto.controlhorario.controllers.dto;

public class IntegridadResponse {

    private int id;
    private String username;
    private String fechaHora_editado; 
    private String fechaHora_original; 
    private String tipo;
    private String huella;
    private String mensaje;

    public IntegridadResponse() {}

    public IntegridadResponse(int id, String username, String fechaHora_original, String fechaHora_editado, String tipo, String huella) {
        this.id = id;
        this.username = username;
        this.fechaHora_original = fechaHora_original;
        this.fechaHora_editado = fechaHora_editado;
        this.tipo = tipo;
        this.huella = huella;
    }
    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }   

    public IntegridadResponse(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getUsername() {
        return username;
    }

    public String getTipo() {
        return tipo;
    }

    public String getHuella() {
        return huella;
    }

    public String getMensaje() {
        return mensaje;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    public void setHuella(String huella) {
        this.huella = huella;
    }
    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getFechaHora_editado() {
        return fechaHora_editado;
    }
    public void setFechaHora_editado(String fechaHora_editado) {
        this.fechaHora_editado = fechaHora_editado;
    }
    public String getFechaHora_original() {
        return fechaHora_original;
    }
    public void setFechaHora_original(String fechaHora_original) {
        this.fechaHora_original = fechaHora_original;
    }
    
}