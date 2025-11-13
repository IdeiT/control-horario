package com.proyecto.controlhorario.controllers;

import java.util.Map;

import org.springframework.web.bind.annotation.*;
import com.proyecto.controlhorario.controllers.dto.SolicitudEdicionRequest;
import com.proyecto.controlhorario.dto.SolicitudFichajeDto;
import com.proyecto.controlhorario.security.JwtUtil;
import com.proyecto.controlhorario.service.EdicionesService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ControladorEdiciones {

    private final EdicionesService servicio;

     public ControladorEdiciones(EdicionesService servicio) {
        this.servicio = servicio;
    }

    @PostMapping("/solicitarEdicion")
    public String editarFichaje(@RequestHeader("Authorization") String authHeader,@RequestBody SolicitudEdicionRequest dto) {

        try {
            String token = authHeader.replace("Bearer ", "");
            Map<String, Object> claims = JwtUtil.validateToken(token);

            String username = (String) claims.get("username");
            String departamento = (String) claims.get("departamento");
            String rol = (String) claims.get("rol");

            SolicitudFichajeDto solicitudEdicion = new SolicitudFichajeDto(username, dto.getFecha(), dto.getNuevaFecha(),
                                                                              dto.getHora(), dto.getNuevaHora(), dto.getTipo(),
                                                                                  dto.getUsoHorario(), rol, departamento);  
            
            // 3️⃣ Registrar solicitud en la tabla correspondiente
            servicio.solicitarEdicion(solicitudEdicion);

            return "✅ Solicitud registrada correctamente para " + username
                    + " en departamento " + departamento;
        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Token inválido o expirado";
        }
    }
    
}
