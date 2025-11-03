package com.proyecto.controlhorario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class InicialData implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbc;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) {
        System.out.println("🔹 Verificando usuarios iniciales...");

        // Usuarios base
        registrarUsuarioSiNoExiste("Jorge", "16tool");
        registrarUsuarioSiNoExiste("Angel", "15vanhalen");

        System.out.println("✅ Usuarios base verificados o creados.");
    }

    private void registrarUsuarioSiNoExiste(String usuario, String password) {
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM usuarios WHERE nombre = ?",
            Integer.class, usuario
        );

        if (count == null || count == 0) {
            String hash = encoder.encode(password);
            jdbc.update("INSERT INTO usuarios (nombre, password) VALUES (?, ?)", usuario, hash);
            System.out.println("👤 Usuario creado: " + usuario);
        } else {
            System.out.println("ℹ️ Usuario '" + usuario + "' ya existe, no se crea de nuevo.");
        }
    }
}
