package com.proyecto.controlhorario.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class Controlador {

    @Autowired
    private JdbcTemplate jdbc;

     private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // ✅ Nuevo endpoint: registrar usuario
    @PostMapping("/registro")
    public String registrar(@RequestBody Map<String, String> body) {
        String usuario = body.get("usuario");
        String password = body.get("password");

        // Hasheamos la contraseña antes de guardarla
        String hash = encoder.encode(password);

        try {
            jdbc.update("INSERT INTO usuarios (nombre, password) VALUES (?, ?)", usuario, hash);
            return "Usuario registrado correctamente";
        } catch (Exception e) {
            return "Error: el usuario ya existe o hubo un problema al registrar";
        }
    }

  // ✅ Login (compara usando BCrypt)
    @PostMapping("/login")
    public boolean login(@RequestBody Map<String, String> body) {
        String usuario = body.get("usuario");          
        String password = body.get("password");

        try {
            String hash = jdbc.queryForObject(
                "SELECT password FROM usuarios WHERE nombre = ?",
                String.class, usuario
            );

            return encoder.matches(password, hash);
        } catch (Exception e) {
            return false; // usuario no encontrado o error
        }
    }

    @PostMapping("/fichar")
    public String fichar(@RequestBody Map<String, String> body) {
        String usuario = body.get("usuario");
        String tipo = body.get("tipo");
        jdbc.update("INSERT INTO fichajes (usuario, tipo, fecha_hora) VALUES (?, ?, ?)",
                usuario, tipo, LocalDateTime.now().toString());
        return "Fichaje registrado";
    }

    @GetMapping("/fichajes")
    public List<Map<String, Object>> listar() {
        return jdbc.queryForList("SELECT * FROM fichajes ORDER BY id DESC");
    }
}
