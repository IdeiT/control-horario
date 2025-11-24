package com.proyecto.controlhorario.dao;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import com.proyecto.controlhorario.dao.entity.Usuario;
import com.proyecto.controlhorario.db.DatabaseManager;
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
    public void registrarUsuario(Usuario usuario, int rolId) {

        String dbPath = dbFolder+"control_general.db";
        
        try {   
            DatabaseManager.withConnection(dbPath, conn -> {
                Integer departamentoId = null;
                String sqlDept = "SELECT id FROM departamentos WHERE nombre = ?";
                try (PreparedStatement stmt = conn.prepareStatement(sqlDept)) {
                    stmt.setString(1, usuario.getDepartamento());
                    ResultSet rs = stmt.executeQuery();
                    if (rs.next()) {
                        departamentoId = rs.getInt("id");
                    } 
                }

                String sqlInsert = "INSERT INTO usuarios (username, password, departamento_id, rol_id) VALUES (?, ?, ?, ?)";
                try (PreparedStatement stmt = conn.prepareStatement(sqlInsert)) {
                    stmt.setString(1, usuario.getUsername());
                    stmt.setString(2, encoder.encode(usuario.getPassword()));

                    if (departamentoId != null) {
                    stmt.setInt(3, departamentoId);
                    } else {
                        stmt.setNull(3, Types.INTEGER); // permite NULL en la columna
                    }

                    stmt.setInt(4, rolId);
                    stmt.executeUpdate();
                }
            });

           System.out.println("✅ Usuario '" + usuario.getUsername() + "' registrado correctamente.");
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("❌ Error al registrar usuario: " + e.getMessage());
        }
    }

    // Devuelve true si el departamento ya existe en la BD
    public boolean existsDepartamento(String departamento) {    
        String dbPath = dbFolder+"control_general.db";
        final boolean[] toret = {false};
        
        try {   
            DatabaseManager.withConnection(dbPath, conn -> {
                String sqlDept = "SELECT id FROM departamentos WHERE nombre = ?";
                try (PreparedStatement stmt = conn.prepareStatement(sqlDept)) {
                    stmt.setString(1, departamento);
                    ResultSet rs = stmt.executeQuery();
                    if (rs.next()) {
                        toret[0] = true;
                    }
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("❌ Error al registrar usuario: " + e.getMessage());
        }   
        return toret[0];
    }


    // Devuelve true si el username ya existe en la BD
    public boolean existsByUsername(String username) {
        String dbPath = dbFolder+"control_general.db";
        final boolean[] toret = {false};
        
        try {   
            DatabaseManager.withConnection(dbPath, conn -> {
                String sqlDept = "SELECT id FROM usuarios WHERE username = ?";
                try (PreparedStatement stmt = conn.prepareStatement(sqlDept)) {
                    stmt.setString(1, username);
                    ResultSet rs = stmt.executeQuery();
                    if (rs.next()) {
                        toret[0] = true;
                    }
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("❌ Error al registrar usuario: " + e.getMessage());
        }   
        return toret[0];
       
    }



    // // ========================
    // // ✅ LOGIN CON TOKEN JWT
    // // ========================
  
    //    Una vez que ya hemos validado en la capa de Servicio que el username ya existe, procedemos a ver si la password es
    //  correcta para devolver una entidad Usuario con toda la info necesaria para el JWT.
    public Usuario existsPassword(String username, String password) {
        String dbPath = Paths.get(dbFolder, "control_general.db").toString();
        final Usuario toret = new Usuario();

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
                    stmt.setString(1, username);
                    ResultSet rs = stmt.executeQuery();

                    if (rs.next()) {
                        String hash = rs.getString("password");
                        if (encoder.matches(password, hash)) {                           
                            String departamento = rs.getString("departamento");
                            String rol = rs.getString("rol");                       

                            // Devolvemos toda la info
                            toret.setUsername(username);
                            toret.setDepartamento(departamento);
                            toret.setRol(rol);
    
                        } else {
                            System.out.println(" Contraseña incorrecta para usuario: " + username);
                            toret.setUsername(null);;
                        }
                    } 
                }
            });
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return toret;
    }


}
