package com.proyecto.controlhorario.controllers.dto;

import com.proyecto.controlhorario.dao.entity.SolicitudEdicion;

public class SolicitudEdicionResponse {
    
    private String username;
    private String viejoInstante;
    private String nuevoInstante;
    private String tipo;
    private String msg;  // Mensaje adicional

    public SolicitudEdicionResponse() {
    }

    public SolicitudEdicionResponse(String msg) {   
        this.msg = msg;
    }

    public SolicitudEdicionResponse(SolicitudEdicion solicitud) {   
        this.nuevoInstante = solicitud.getNuevoInstante();
        this.tipo = solicitud.getTipo();
    }

    // Getters y Setters
    public String getMsg() {
        return msg;
    }
    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getViejoInstante() {
        return viejoInstante;
    }

    public void setViejoInstante(String viejoInstante) {
        this.viejoInstante = viejoInstante;
    }

    public String getNuevoInstante() {
        return nuevoInstante;
    }

    public void setNuevoInstante(String nuevoInstante) {
        this.nuevoInstante = nuevoInstante;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}