package com.proyecto.controlhorario.dto;


public class SolicitudFichajeDto {

    private String username;     // usuario que solicita la modificación
    private String fecha;        // fecha que se pretende cambiar
    private String nuevaFecha;   // nueva fecha a registrar

    private String hora;         // hora que se pretende cambiar
    private String nuevaHora;    // nueva hora a registrar (ej: "08:45")

    private String tipo;         // "entrada" o "salida"
    private String usoHorario;   // uso horario del Frontend (ej: "UTC +0", "UTC +1", etc.)

    private String rol;         
    private String departamento;   

    
    public SolicitudFichajeDto(String username, String fecha, String nuevaFecha,
                                    String hora, String nuevaHora, String tipo,
                                    String usoHorario, String rol, String departamento) {
        this.username = username;
        this.fecha = fecha;
        this.nuevaFecha = nuevaFecha;
        this.hora = hora;
        this.nuevaHora = nuevaHora;
        this.tipo = tipo;
        this.usoHorario = usoHorario;
        this.rol = rol;
        this.departamento = departamento;
    }

    // 🔹 Getters y Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

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

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }
}

