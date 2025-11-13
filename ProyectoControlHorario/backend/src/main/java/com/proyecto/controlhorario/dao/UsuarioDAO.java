package com.proyecto.controlhorario.dao;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import com.proyecto.controlhorario.dao.entity.Usuarios;
import com.proyecto.controlhorario.db.DatabaseManager;
import com.proyecto.controlhorario.dto.LoginDto;
import com.proyecto.controlhorario.dto.RegistroDto;
import java.nio.file.Paths;
import java.sql.*;

@Repository
public class UsuarioDAO {
    @Value("${app.db.folder}")
    private String dbFolder;

    //   Clase de Spring Security que aplica el algoritmo BCrypt, un tipo de hash seguro diseñado para cifrar
    //  contraseñas antes de guardarlas en la base de datos.
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // // ==========================
    // // ✅ REGISTAR NUEVO USUARIO
    // // ==========================
    public String registrarUsuario(RegistroDto registroDto) {

        String dbPath = dbFolder+"control_general.db";
        Usuarios usuario=new Usuarios(
            registroDto.getUsername(),
            registroDto.getPassword(),
            registroDto.getDepartamento(),
            registroDto.getRol()
        );
        
        try {   
            DatabaseManager.withConnection(dbPath, conn -> {
                Integer departamentoId = null;
                String sqlDept = "SELECT id FROM departamentos WHERE nombre = ?";
                try (PreparedStatement stmt = conn.prepareStatement(sqlDept)) {
                    stmt.setString(1, usuario.getDepartamento());
                    ResultSet rs = stmt.executeQuery();
                    if (rs.next()) {
                        departamentoId = rs.getInt("id");
                    } else {
                        throw new SQLException("Departamento no encontrado: " + usuario.getDepartamento());
                    }
                }

                Integer rolId = null;
                String sqlRol = "SELECT id FROM roles WHERE nombre = ?";
                try (PreparedStatement stmt = conn.prepareStatement(sqlRol)) {
                    stmt.setString(1, usuario.getRol());
                    ResultSet rs = stmt.executeQuery();
                    if (rs.next()) {
                        rolId = rs.getInt("id");
                    } else {
                        throw new SQLException("Rol no encontrado: " + usuario.getRol());
                    }
                }

                String sqlInsert = "INSERT INTO usuarios (username, password, departamento_id, rol_id) VALUES (?, ?, ?, ?)";
                try (PreparedStatement stmt = conn.prepareStatement(sqlInsert)) {
                    stmt.setString(1, usuario.getUsername());
                    stmt.setString(2, encoder.encode(usuario.getPassword()));
                    stmt.setInt(3, departamentoId);
                    stmt.setInt(4, rolId);
                    stmt.executeUpdate();
                }
            });

            return "✅ Usuario '" + usuario.getUsername() + "' registrado correctamente.";

        } catch (SQLException e) {
            if (e.getMessage().contains("UNIQUE constraint")) {
                return "⚠️ El usuario '" + usuario.getUsername() + "' ya existe.";
            }
            e.printStackTrace();
            return "❌ Error al registrar usuario: " + e.getMessage();
        }
    }



    // // ========================
    // // ✅ LOGIN CON TOKEN JWT
    // // ========================
    public LoginDto loginUsuario(LoginDto dto) {
        String usuario = dto.getUsername();
        String password = dto.getPassword();

        String dbPath = Paths.get(dbFolder, "control_general.db").toString();
        final LoginDto toret = new LoginDto();

        try {
            DatabaseManager.withConnection(dbPath, conn -> {
                String sql = """
                    SELECT u.password, d.nombre AS departamento, r.nombre AS rol
                    FROM usuarios u
                    LEFT JOIN departamentos d ON u.departamento_id = d.id
                    LEFT JOIN roles r ON u.rol_id = r.id
                    WHERE u.username = ?;
                """;

                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, usuario);
                    ResultSet rs = stmt.executeQuery();

                    if (rs.next()) {
                        String hash = rs.getString("password");
                        if (encoder.matches(password, hash)) {
                            String departamento = rs.getString("departamento");
                            String rol = rs.getString("rol");                       

                            // Devolvemos toda la info
                            toret.setUsername(usuario);
                            toret.setDepartamento(departamento);
                            toret.setRol(rol);
    
                        } else {
                            System.out.println(" Contraseña incorrecta para usuario: " + usuario);
                        }
                    } else {
                        System.out.println(" Usuario no encontrado: " + usuario);
                    }
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return toret;
    }


}
