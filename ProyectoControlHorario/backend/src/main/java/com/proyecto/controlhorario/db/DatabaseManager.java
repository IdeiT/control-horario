package com.proyecto.controlhorario.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.concurrent.ConcurrentHashMap;

/**
 * DatabaseManager mejorado:
 * - Gestiona conexiones SQLite con cierre automático.
 * - Evita problemas de concurrencia usando bloqueos por base de datos.
 * - Facilita el uso de try-with-resources.
 * 
 * 
 *             Aspecto	                withConnection()	                  withTransaction()
       AutoCommit	                   true (por defecto)	                   false (manual)
   Rollback automático	                    ❌ No	                             ✅ Sí
        Uso ideal	            Lecturas y operaciones simples	          Múltiples operaciones que deben ser atómicas
 */
public class DatabaseManager {

    // Mapa de bloqueos por base de datos (para operaciones sincronizadas)
    private static final ConcurrentHashMap<String, Object> dbLocks = new ConcurrentHashMap<>();

    static {
        try {
            // Registrar el driver JDBC de SQLite
            Class.forName("org.sqlite.JDBC");
        } catch (ClassNotFoundException e) {
            throw new ExceptionInInitializerError("❌ No se encontró el driver JDBC de SQLite.");
        }
    }

    /**
     * Devuelve una conexión SQLite a la base de datos indicada.
     * El llamante es responsable de cerrarla (idealmente con try-with-resources).
     */
    public static Connection getConnection(String dbPath) throws SQLException {
        String url = "jdbc:sqlite:" + dbPath;
        return DriverManager.getConnection(url);
    }

    /**
     * Devuelve un objeto de bloqueo específico para cada base de datos.
     * Se usa para sincronizar operaciones de escritura concurrentes.
     */
    public static Object getLock(String dbPath) {
        return dbLocks.computeIfAbsent(dbPath, k -> new Object());
    }

    /**
     * Ejecuta una operación con una conexión gestionada automáticamente.
     * Usa try-with-resources para garantizar el cierre.
     *
     * Ejemplo de uso:
     * DatabaseManager.withConnection("db/control_general.db", conn -> {
     *     try (PreparedStatement ps = conn.prepareStatement("SELECT * FROM usuarios")) {
     *         ResultSet rs = ps.executeQuery();
     *         while (rs.next()) {
     *             System.out.println(rs.getString("nombre"));
     *         }
     *     }
     * });
     */
    public static void withConnection(String dbPath, DatabaseOperation operation) throws SQLException {
        synchronized (getLock(dbPath)) {
            try (Connection conn = getConnection(dbPath)) {
                operation.execute(conn);
            }
        }
    }


    /**
     * Ejecuta una operación transaccional con gestión automática de commit/rollback. 
     * - Desactiva autoCommit al inicio
     * - Hace COMMIT si la operación se completa sin errores
     * - Hace ROLLBACK automáticamente si ocurre alguna excepción
     * - Restaura autoCommit al final
     * - Usa try-with-resources para garantizar el cierre de la conexión
     *
     * Ejemplo de uso:
     * DatabaseManager.withTransaction("db/departamento_it. db", conn -> {
     *     try (PreparedStatement ps1 = conn.prepareStatement("INSERT INTO ediciones ... ")) {
     *         ps1.executeUpdate();
     *     }
     *     try (PreparedStatement ps2 = conn. prepareStatement("UPDATE solicitud_edicion ...")) {
     *         ps2.executeUpdate();
     *     }
     *     // Si ambas operaciones tienen éxito, se hace COMMIT automático
     * });
     */
    public static void withTransaction(String dbPath, DatabaseOperation operation) throws SQLException {
        synchronized (getLock(dbPath)) {
            // ========== TRY-WITH-RESOURCES: La conexión se cierra automáticamente ==========
            try (Connection conn = getConnection(dbPath)) {
                boolean originalAutoCommit = conn.getAutoCommit();
                
                try {
                    // Iniciar transacción
                    conn.setAutoCommit(false);
                    
                    // Ejecutar operación
                    operation.execute(conn);
                    
                    // Si llegamos aquí, todo OK → COMMIT
                    conn.commit();
                    
                } catch (SQLException e) {
                    // Si hay error → ROLLBACK
                    try {
                        conn.rollback();
                        System.err. println("❌ ROLLBACK ejecutado debido a error: " + e.getMessage());
                    } catch (SQLException rollbackEx) {
                        System.err.println("❌ Error crítico durante ROLLBACK: " + rollbackEx.getMessage());
                        rollbackEx.addSuppressed(e);
                        throw rollbackEx;
                    }
                    throw e;
                    
                } finally {
                    // Restaurar autoCommit
                    try {
                        conn.setAutoCommit(originalAutoCommit);
                    } catch (SQLException e) {
                        System.err. println("⚠️ Advertencia: No se pudo restaurar autoCommit");
                    }
                }
            } // La conexión se cierra automáticamente aquí por try-with-resources
        }
    }

    /**
     * Interfaz funcional para operaciones SQL sobre una conexión.
     */
    @FunctionalInterface
    public interface DatabaseOperation {
        void execute(Connection conn) throws SQLException;
    }
}
