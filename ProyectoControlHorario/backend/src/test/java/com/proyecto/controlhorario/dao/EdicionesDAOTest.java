package com.proyecto.controlhorario.dao;

import com.proyecto.controlhorario.controllers.dto.AprobarSolicitudResponse;
import com.proyecto.controlhorario.dao.entity.Edicion;
import com.proyecto.controlhorario.db.DatabaseManager;
import org. junit.jupiter.api.*;
import org.springframework.beans.factory.annotation. Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java. sql.SQLException;

import static org.junit.jupiter. api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "app.db.folder=src/test/resources/db_test/"
})
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class EdicionesDAOTransactionTest {

    @Autowired
    private EdicionesDAO edicionesDAO;

    private static final String TEST_DEPARTAMENTO = "testing";
    private static final String TEST_DB_PATH = "src/test/resources/db_test/departamento_testing.db";

    @BeforeEach
    void setUp() throws SQLException {
        // Preparar base de datos de prueba con datos iniciales
        DatabaseManager.withConnection(TEST_DB_PATH, conn -> {
            // Limpiar tablas
            conn.createStatement().execute("DELETE FROM ediciones");
            conn. createStatement().execute("DELETE FROM solicitud_edicion");
            conn.createStatement().execute("DELETE FROM fichajes");
            
            // Insertar fichaje de prueba
            String insertFichaje = "INSERT INTO fichajes (id, username, instante, tipo, huella) VALUES (1, 'test_user', '2025-12-01 09:00:00', 'ENTRA', 'hash_original')";
            conn.createStatement().execute(insertFichaje);
            
            // Insertar solicitud de edición pendiente
            String insertSolicitud = "INSERT INTO solicitud_edicion (id, fichaje_id, nuevo_instante, tipo, aprobado) VALUES (1, 1, '2025-12-01 09:15:00', 'ENTRA', 'FALSO')";
            conn.createStatement().execute(insertSolicitud);
        });
    }

    @AfterEach
    void tearDown() throws SQLException {
        // Limpiar después de cada test
        DatabaseManager.withConnection(TEST_DB_PATH, conn -> {
            conn.createStatement(). execute("DELETE FROM ediciones");
            conn.createStatement().execute("DELETE FROM solicitud_edicion");
            conn.createStatement().execute("DELETE FROM fichajes");
        });
    }

    // ========== TEST 1: CASO EXITOSO (Happy Path) ==========
    @Test
    @Order(1)
    @DisplayName("✅ Debe aprobar solicitud correctamente y commitear las 3 operaciones")
    void testAprobarSolicitud_CasoExitoso() throws SQLException {
        // Arrange
        Edicion edicion = new Edicion();
        edicion.setFichajeId(1);
        edicion.setNuevoInstante("2025-12-01 09:15:00");
        edicion. setTipo("ENTRA");
        
        // Act
        AprobarSolicitudResponse response = edicionesDAO.aprobarSolicitudEdicion(edicion, TEST_DEPARTAMENTO, 1);
        
        // Assert
        assertNotNull(response);
        
        // Verificar que se insertó en 'ediciones'
        DatabaseManager.withConnection(TEST_DB_PATH, conn -> {
            String queryEdiciones = "SELECT COUNT(*) as count, id FROM ediciones WHERE fichaje_id = 1";
            try (PreparedStatement ps = conn.prepareStatement(queryEdiciones);
                 ResultSet rs = ps.executeQuery()) {
                assertTrue(rs.next());
                assertEquals(1, rs.getInt("count"), "Debe existir 1 edición");
                int idEdicion = rs.getInt("id");
                assertTrue(idEdicion > 0, "El ID de edición debe ser mayor a 0");
                
                // Verificar que se actualizó 'solicitud_edicion'
                String querySolicitud = "SELECT aprobado FROM solicitud_edicion WHERE id = 1";
                try (PreparedStatement ps2 = conn.prepareStatement(querySolicitud);
                     ResultSet rs2 = ps2.executeQuery()) {
                    assertTrue(rs2.next());
                    assertEquals("VERDADERO", rs2.getString("aprobado"), "La solicitud debe estar aprobada");
                }
                
                // Verificar que se actualizó 'fichajes'
                String queryFichajes = "SELECT id_edicion FROM fichajes WHERE id = 1";
                try (PreparedStatement ps3 = conn. prepareStatement(queryFichajes);
                     ResultSet rs3 = ps3.executeQuery()) {
                    assertTrue(rs3.next());
                    assertEquals(idEdicion, rs3. getInt("id_edicion"), "El fichaje debe tener el id_edicion correcto");
                }
            }
        });
    }

    // ========== TEST 2: ROLLBACK - Fichaje no existe ==========
    @Test
    @Order(2)
    @DisplayName("❌ Debe hacer ROLLBACK si el fichaje no existe")
    void testAprobarSolicitud_RollbackFichajeNoExiste() {
        // Arrange
        Edicion edicion = new Edicion();
        edicion.setFichajeId(999); // ID que no existe
        edicion. setNuevoInstante("2025-12-01 09:15:00");
        edicion.setTipo("ENTRA");
        
        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            edicionesDAO.aprobarSolicitudEdicion(edicion, TEST_DEPARTAMENTO, 1);
        });
        
        // Verificar que NO se insertó nada en 'ediciones'
        assertDoesNotThrow(() -> {
            DatabaseManager.withConnection(TEST_DB_PATH, conn -> {
                String query = "SELECT COUNT(*) as count FROM ediciones";
                try (PreparedStatement ps = conn.prepareStatement(query);
                     ResultSet rs = ps.executeQuery()) {
                    assertTrue(rs.next());
                    assertEquals(0, rs. getInt("count"), "NO debe haber ediciones después del rollback");
                }
                
                // Verificar que la solicitud sigue en FALSO
                String querySolicitud = "SELECT aprobado FROM solicitud_edicion WHERE id = 1";
                try (PreparedStatement ps2 = conn.prepareStatement(querySolicitud);
                     ResultSet rs2 = ps2.executeQuery()) {
                    assertTrue(rs2.next());
                    assertEquals("FALSO", rs2.getString("aprobado"), "La solicitud debe seguir sin aprobar");
                }
            });
        });
    }

    // ========== TEST 3: ROLLBACK - Solicitud no existe ==========
    @Test
    @Order(3)
    @DisplayName("❌ Debe hacer ROLLBACK si la solicitud no existe o ya está aprobada")
    void testAprobarSolicitud_RollbackSolicitudNoValida() {
        // Arrange
        Edicion edicion = new Edicion();
        edicion.setFichajeId(1);
        edicion. setNuevoInstante("2025-12-01 09:15:00");
        edicion.setTipo("ENTRA");
        
        // Act & Assert - solicitud con ID inexistente
        assertThrows(RuntimeException.class, () -> {
            edicionesDAO.aprobarSolicitudEdicion(edicion, TEST_DEPARTAMENTO, 999);
        });
        
        // Verificar que NO se insertó nada
        assertDoesNotThrow(() -> {
            DatabaseManager.withConnection(TEST_DB_PATH, conn -> {
                String query = "SELECT COUNT(*) as count FROM ediciones";
                try (PreparedStatement ps = conn.prepareStatement(query);
                     ResultSet rs = ps.executeQuery()) {
                    assertTrue(rs.next());
                    assertEquals(0, rs.getInt("count"), "NO debe haber ediciones después del rollback");
                }
                
                // Verificar que el fichaje NO tiene id_edicion
                String queryFichajes = "SELECT id_edicion FROM fichajes WHERE id = 1";
                try (PreparedStatement ps2 = conn.prepareStatement(queryFichajes);
                     ResultSet rs2 = ps2.executeQuery()) {
                    assertTrue(rs2.next());
                    assertNull(rs2.getObject("id_edicion"), "El fichaje NO debe tener id_edicion después del rollback");
                }
            });
        });
    }

    // ========== TEST 4: ROLLBACK - Simular error en tercera operación ==========
    @Test
    @Order(4)
    @DisplayName("❌ Debe hacer ROLLBACK completo si falla la última operación (UPDATE fichajes)")
    void testAprobarSolicitud_RollbackEnTerceraOperacion() throws SQLException {
        // Arrange - Eliminar el fichaje para que falle el último UPDATE
        DatabaseManager.withConnection(TEST_DB_PATH, conn -> {
            // Primero aprobar para que las dos primeras operaciones funcionen
            // pero modificamos para que la tercera falle
            conn. createStatement().execute("DELETE FROM fichajes WHERE id = 1");
        });
        
        Edicion edicion = new Edicion();
        edicion.setFichajeId(1);
        edicion.setNuevoInstante("2025-12-01 09:15:00");
        edicion.setTipo("ENTRA");
        
        // Act & Assert
        assertThrows(RuntimeException. class, () -> {
            edicionesDAO.aprobarSolicitudEdicion(edicion, TEST_DEPARTAMENTO, 1);
        });
        
        // Verificar que NINGUNA de las 3 operaciones se aplicó
        DatabaseManager.withConnection(TEST_DB_PATH, conn -> {
            // 1. NO debe haber ediciones
            String queryEdiciones = "SELECT COUNT(*) as count FROM ediciones";
            try (PreparedStatement ps = conn.prepareStatement(queryEdiciones);
                 ResultSet rs = ps.executeQuery()) {
                assertTrue(rs.next());
                assertEquals(0, rs.getInt("count"), "NO debe haber ediciones después del rollback");
            }
            
            // 2. La solicitud debe seguir en FALSO
            String querySolicitud = "SELECT aprobado FROM solicitud_edicion WHERE id = 1";
            try (PreparedStatement ps2 = conn.prepareStatement(querySolicitud);
                 ResultSet rs2 = ps2.executeQuery()) {
                assertTrue(rs2.next());
                assertEquals("FALSO", rs2.getString("aprobado"), "La solicitud debe seguir sin aprobar");
            }
        });
    }

    // ========== TEST 5: VALIDACIÓN - Solicitud ya aprobada ==========
    @Test
    @Order(5)
    @DisplayName("❌ No debe permitir aprobar una solicitud que ya está aprobada")
    void testAprobarSolicitud_SolicitudYaAprobada() throws SQLException {
        // Arrange - Aprobar primero la solicitud
        Edicion edicion = new Edicion();
        edicion.setFichajeId(1);
        edicion.setNuevoInstante("2025-12-01 09:15:00");
        edicion.setTipo("ENTRA");
        
        edicionesDAO.aprobarSolicitudEdicion(edicion, TEST_DEPARTAMENTO, 1);
        
        // Act & Assert - Intentar aprobar de nuevo
        assertThrows(RuntimeException.class, () -> {
            edicionesDAO.aprobarSolicitudEdicion(edicion, TEST_DEPARTAMENTO, 1);
        });
    }

    // ========== TEST 6: CONCURRENCIA (Opcional pero recomendado) ==========
    @Test
    @Order(6)
    @DisplayName("🔒 Debe manejar correctamente solicitudes concurrentes")
    void testAprobarSolicitud_Concurrencia() throws SQLException, InterruptedException {
        // Arrange - Crear múltiples solicitudes
        DatabaseManager.withConnection(TEST_DB_PATH, conn -> {
            conn.createStatement().execute("INSERT INTO fichajes (id, username, instante, tipo, huella) VALUES (2, 'user2', '2025-12-01 10:00:00', 'SALE', 'hash2')");
            conn.createStatement().execute("INSERT INTO solicitud_edicion (id, fichaje_id, nuevo_instante, tipo, aprobado) VALUES (2, 2, '2025-12-01 10:15:00', 'SALE', 'FALSO')");
        });
        
        // Act - Ejecutar aprobaciones en paralelo
        Thread t1 = new Thread(() -> {
            try {
                Edicion e1 = new Edicion();
                e1.setFichajeId(1);
                e1.setNuevoInstante("2025-12-01 09:15:00");
                e1.setTipo("ENTRA");
                edicionesDAO.aprobarSolicitudEdicion(e1, TEST_DEPARTAMENTO, 1);
            } catch (Exception e) {
                fail("Thread 1 falló: " + e.getMessage());
            }
        });
        
        Thread t2 = new Thread(() -> {
            try {
                Edicion e2 = new Edicion();
                e2.setFichajeId(2);
                e2.setNuevoInstante("2025-12-01 10:15:00");
                e2. setTipo("SALE");
                edicionesDAO.aprobarSolicitudEdicion(e2, TEST_DEPARTAMENTO, 2);
            } catch (Exception e) {
                fail("Thread 2 falló: " + e.getMessage());
            }
        });
        
        t1. start();
        t2.start();
        t1.join();
        t2.join();
        
        // Assert - Ambas deben haberse ejecutado correctamente
        DatabaseManager.withConnection(TEST_DB_PATH, conn -> {
            String query = "SELECT COUNT(*) as count FROM ediciones";
            try (PreparedStatement ps = conn.prepareStatement(query);
                 ResultSet rs = ps.executeQuery()) {
                assertTrue(rs.next());
                assertEquals(2, rs. getInt("count"), "Deben existir 2 ediciones");
            }
        });
    }
}
