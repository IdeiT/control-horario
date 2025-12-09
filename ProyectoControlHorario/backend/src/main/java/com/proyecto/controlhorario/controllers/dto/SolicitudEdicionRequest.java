package com.proyecto.controlhorario.controllers.dto;

public class SolicitudEdicionRequest {
    
    private int id_fichaje;      // id del registro que se pretende cambiar(en la tabla Fichajes)
    private String nuevoInstante;   // nuevo instante a registrar

    // Cuando tú envías un JSON desde el frontend o Postman en el cuerpo (@RequestBody),
    // Spring Boot necesita convertir ese JSON en un objeto Java (SolicitudEdicionRequest) automáticamente.
    // Ese proceso se llama “deserialización”.
    
    // 🔹 Constructor vacío (necesario para deserialización JSON)
    public SolicitudEdicionRequest() {
    }

    // 🔹 Constructor completo
    public SolicitudEdicionRequest(int id_fichaje, String nuevoInstante) {
        this.id_fichaje = id_fichaje;
        this.nuevoInstante = nuevoInstante;
    }

    // 🔹 Getters y Setters
    public int getId_fichaje() {
        return id_fichaje;
    }
    public void setId_fichaje(int id_fichaje) {
        this.id_fichaje = id_fichaje;
    }
    public String getNuevoInstante() {
        return nuevoInstante;
    }
    public void setNuevoInstante(String nuevoInstante) {
        this.nuevoInstante = nuevoInstante;
    }  
}
