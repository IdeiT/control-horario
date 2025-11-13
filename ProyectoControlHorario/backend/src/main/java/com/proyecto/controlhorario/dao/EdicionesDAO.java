package com.proyecto.controlhorario.dao;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import com.proyecto.controlhorario.dto.SolicitudFichajeDto;
import com.proyecto.controlhorario.dao.entity.SolicitudEdicion;

@Repository
public class EdicionesDAO {
    @Value("${app.db.folder}")
    private String dbFolder;


    public String solicitarEdicion(SolicitudFichajeDto solicitudFichajeDto) {

        String dbPath = dbFolder+"departamento_"+solicitudFichajeDto.getDepartamento().toLowerCase()+".db";
        System.out.println("Ruta DB para solicitud de edición: " + dbPath);

        SolicitudEdicion solicitudEdicion=new SolicitudEdicion();
        solicitudEdicion.setNuevoInstante(solicitudFichajeDto.getNuevaFecha() + " " + solicitudFichajeDto.getNuevaHora());
        solicitudEdicion.setTipo(solicitudFichajeDto.getTipo());
        solicitudEdicion.rechazar();


        return "funciona";
    }

}
