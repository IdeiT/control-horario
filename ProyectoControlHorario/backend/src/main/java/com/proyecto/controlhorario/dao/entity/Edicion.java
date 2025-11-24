package com.proyecto.controlhorario.dao.entity;

public class Edicion {
    
    private int fichajeId;
    private String nuevoInstante;
    private String tipo;        // 'ENTRA' o 'SALE'
    private String huellaTablaFichaje; // Huella del fichaje original en la tabla Fichajes
    private String huella;
    

    public Edicion() {
    }




    public int getFichajeId() {
        return fichajeId;
    }

    public void setFichajeId(int fichajeId) {
        this.fichajeId = fichajeId;
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
    
    public String getHuella() {
        return huella;
    }
    public void setHuella(String huella) {
        this.huella = huella;
    }
    
    public String getHuellaTablaFichaje() {
        return huellaTablaFichaje;
    }

    public void setHuellaTablaFichaje(String huellaTablaFichaje) {
        this.huellaTablaFichaje = huellaTablaFichaje;
    }

}