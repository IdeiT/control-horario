package com.proyecto.controlhorario.controllers.dto;


public class ListarFichajeUsuarioResponse {
     // Response DTO (lo que devuelves al frontend)

    private String instante;
    private String tipo;

    public ListarFichajeUsuarioResponse() {}

    public ListarFichajeUsuarioResponse(String instante, String tipo) {
        this.instante = instante;
        this.tipo = tipo;             
    }
    public String getInstante() {
        return instante;
    }

    public String getTipo() {
        return tipo;
    }
    public void setInstante(String instante) {
        this.instante = instante;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

}
