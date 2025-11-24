package com.proyecto.controlhorario.controllers.dto;

public class IntegridadResponse {

    private String username;
    private String instante;
    private String tipo;
    private String huella;
    private String mensaje;

    public IntegridadResponse() {}

    public IntegridadResponse(String username, String instante, String tipo, String huella, String mensaje) {
        this.username = username;
        this.instante = instante;
        this.tipo = tipo;
        this.huella = huella;
        this.mensaje = mensaje;
    }

    public IntegridadResponse(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getUsername() {
        return username;
    }

    public String getInstante() {
        return instante;
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
    public void setInstante(String instante) {
        this.instante = instante;
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
}