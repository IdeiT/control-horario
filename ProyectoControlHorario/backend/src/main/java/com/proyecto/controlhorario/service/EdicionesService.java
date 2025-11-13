package com.proyecto.controlhorario.service;

import org.springframework.stereotype.Service;

import com.proyecto.controlhorario.dao.EdicionesDAO;
import com.proyecto.controlhorario.dto.SolicitudFichajeDto;

@Service
public class EdicionesService {
    
    private final EdicionesDAO solicitudEdicionDAO;

    public  EdicionesService(EdicionesDAO solicitudEdicionDAO) {
        this.solicitudEdicionDAO = solicitudEdicionDAO;
    }

    public void solicitarEdicion(SolicitudFichajeDto dto) {
        System.out.println(solicitudEdicionDAO.solicitarEdicion(dto));
    }
}
