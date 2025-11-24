package com.proyecto.controlhorario.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JwtUtil {

    // 🔑 Clave secreta (puedes moverla a application.properties)
    
    //   En un entorno real, no debería generarse así cada vez, porque cambia cada vez que reinicias la aplicación.
    //   En producción, la clave se guarda en un archivo de configuración (application.properties), por ejemplo:
    //     jwt.secret=mi_clave_secreta_segura

    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    // Esta línea genera una nueva clave secreta cada vez que se inicia la aplicación.
    // Problema: todos los JWT generados antes de reiniciar la app dejarán de ser válidos

    // ⏳ Tiempo de expiración: 24 horas
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    /**
     * Genera un token JWT con los datos del usuario.
     */
    public static String generateToken(String username, String departamento, String rol) {
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        claims.put("rol", rol);
        claims.put("departamento", departamento);

        return Jwts.builder()
                .setSubject(username)
                .addClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    /**
     * Valida y devuelve los claims del token.
     */
    public static Map<String, Object> validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
