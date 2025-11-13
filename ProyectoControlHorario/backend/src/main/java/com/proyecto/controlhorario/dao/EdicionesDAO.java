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

        String dbPath = dbFolder+"control_general.db";

        SolicitudEdicion solicitudEdicion=new SolicitudEdicion();
        System.out.println("Ruta DB para solicitud de edición: " + dbPath);

        solicitudEdicion.setUsername(solicitudFichajeDto.getUsername());
        solicitudEdicion.setFecha(solicitudFichajeDto.getFecha());
        solicitudEdicion.setHoraOriginal(solicitudFichajeDto.getHoraOriginal());
        solicitudEdicion.setHoraSolicitada(solicitudFichajeDto.getHoraSolicitada());
        solicitudEdicion.setMotivo(solicitudFichajeDto.getMotivo());
        solicitudEdicion.setDepartamento(solicitudFichajeDto.getDepartamento());



        return resultado;
    }

}
