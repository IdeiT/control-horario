package com.proyecto.controlhorario.controllers;

import com.proyecto.controlhorario.controllers.dto.LoginRequest;
import com.proyecto.controlhorario.controllers.dto.RegistroRequest;
import com.proyecto.controlhorario.dto.LoginDto;
import com.proyecto.controlhorario.dto.RegistroDto;
import com.proyecto.controlhorario.service.*;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/general")
@CrossOrigin(origins = "http://localhost:4200")
public class ControladorUsuario {

    // Leemos la ruta base de las bases de datos desde application.properties
    @Value("${app.db.folder}")
    private String dbFolder;
    private final UsuarioService servicio;

    public ControladorUsuario(UsuarioService servicio) {
        this.servicio = servicio;
    }


    @PostMapping("/registro")
    public ResponseEntity<String> crearRegistro(@Valid @RequestBody RegistroRequest dto) {

        try {

            RegistroDto registro = new RegistroDto(
                    dto.getUsername(),
                    dto.getPassword(),
                    dto.getDepartamento(),
                    dto.getRol()
            );  

            servicio.guardarRegistro(registro);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("✅ Registro guardado correctamente");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("❌ Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Error interno: " + e.getMessage());
        }
    }




    @PostMapping("/login")
    public ResponseEntity<String> loginUsuario(@Valid @RequestBody LoginRequest dto) {

        try {

            LoginDto login = new LoginDto(
                    dto.getUsername(),
                    dto.getPassword()
            );  

            LoginDto ldto=servicio.solicitarLogin(login);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ldto.getToken());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("❌ Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Error interno: " + e.getMessage());
        }
    }

   
}
