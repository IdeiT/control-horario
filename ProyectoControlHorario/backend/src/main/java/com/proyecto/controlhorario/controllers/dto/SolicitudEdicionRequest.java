package com.proyecto.controlhorario.controllers.dto;

public class SolicitudEdicionRequest {
    
    private String fecha;        // fecha que se pretende cambiar
    private String nuevaFecha;   // nueva fecha a registrar

    private String hora;         // hora que se pretende cambiar
    private String nuevaHora;    // nueva hora a registrar (ej: "08:45")

    private String tipo;         // "entrada" o "salida"
    private String usoHorario;   // uso horario del Frontend (ej: "UTC +0", "UTC +1", etc.)

    // Cuando tú envías un JSON desde el frontend o Postman en el cuerpo (@RequestBody),
    // Spring Boot necesita convertir ese JSON en un objeto Java (SolicitudEdicionRequest) automáticamente.
    // Ese proceso se llama “deserialización”.
    
    // 🔹 Constructor vacío (necesario para deserialización JSON)
    public SolicitudEdicionRequest() {
    }

    // 🔹 Constructor completo
    public SolicitudEdicionRequest(String fecha, String nuevaFecha,
                                    String hora, String nuevaHora, String tipo,
                                    String usoHorario) {
        this.fecha = fecha;
        this.nuevaFecha = nuevaFecha;
        this.hora = hora;
        this.nuevaHora = nuevaHora;
        this.tipo = tipo;
        this.usoHorario = usoHorario;
    }

    // 🔹 Getters y Setters
    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getNuevaFecha() {
        return nuevaFecha;
    }

    public void setNuevaFecha(String nuevaFecha) {
        this.nuevaFecha = nuevaFecha;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public String getNuevaHora() {
        return nuevaHora;
    }

    public void setNuevaHora(String nuevaHora) {
        this.nuevaHora = nuevaHora;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getUsoHorario() {
        return usoHorario;
    }

    public void setUsoHorario(String usoHorario) {
        this.usoHorario = usoHorario;
    }
    
}
