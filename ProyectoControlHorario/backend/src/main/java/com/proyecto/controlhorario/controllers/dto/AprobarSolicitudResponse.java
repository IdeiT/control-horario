package com.proyecto.controlhorario.controllers.dto;

import com.proyecto.controlhorario.dao.entity.Edicion;

public class AprobarSolicitudResponse {


    private String nuevoInstante;
    private String tipo;        // 'ENTRA' o 'SALE'
    private String msg;  // Mensaje adicional

    public AprobarSolicitudResponse() {
    }

    public AprobarSolicitudResponse(Edicion edicion) {
        this.nuevoInstante = edicion.getNuevoInstante();
        this.tipo = edicion.getTipo();
    }

    public AprobarSolicitudResponse(String msg) {   
        this.msg = msg;
    }

    // Getters y Setters
    public String getMsg() {
        return msg;
    }
    public void setMsg(String msg) {
        this.msg = msg;
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
