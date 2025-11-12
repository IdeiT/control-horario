package com.proyecto.controlhorario.service;

import org.springframework.stereotype.Service;
import com.proyecto.controlhorario.dao.FichajesDAO;
import com.proyecto.controlhorario.dto.FichajeDto;

@Service
public class FichajesService {

    private final FichajesDAO fichajeDAO;

    public  FichajesService(FichajesDAO fichajeDAO) {
        this.fichajeDAO = fichajeDAO;
    }

    public void ficharUsuario(FichajeDto dto) {
        System.out.println(fichajeDAO.ficharUsuario(dto));
    }


}
