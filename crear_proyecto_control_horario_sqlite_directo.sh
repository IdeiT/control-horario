#!/bin/bash
set -e

echo "=========================================================="
echo "🧩 Generando ProyectoControlHorario (Spring Boot + Angular 20)"
echo "=========================================================="

PROYECTO_DIR="$(pwd)/ProyectoControlHorario"
BACKEND_DIR="$PROYECTO_DIR/backend"
FRONTEND_DIR="$PROYECTO_DIR/frontend"
DB_DIR="$BACKEND_DIR/db"

mkdir -p "$BACKEND_DIR/src/main/java/com/proyecto/controlhorario/controller"
mkdir -p "$BACKEND_DIR/src/main/java/com/proyecto/controlhorario/service"
mkdir -p "$BACKEND_DIR/src/main/java/com/proyecto/controlhorario/model"
mkdir -p "$BACKEND_DIR/src/main/resources"
mkdir -p "$DB_DIR"

# ==========================================================
# BACKEND - Spring Boot con SQLite directo (sin Hibernate)
# ==========================================================

cat > "$BACKEND_DIR/pom.xml" <<'EOF'
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.proyecto</groupId>
    <artifactId>ProyectoControlHorario</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>

    <properties>
        <java.version>17</java.version>
        <spring-boot.version>3.3.5</spring-boot.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.xerial</groupId>
            <artifactId>sqlite-jdbc</artifactId>
            <version>3.46.0.0</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
EOF

# Application principal
cat > "$BACKEND_DIR/src/main/java/com/proyecto/controlhorario/ProyectoControlHorarioApplication.java" <<'EOF'
package com.proyecto.controlhorario;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProyectoControlHorarioApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProyectoControlHorarioApplication.class, args);
    }
}
EOF

# application.properties
cat > "$BACKEND_DIR/src/main/resources/application.properties" <<'EOF'
server.port=8080
spring.datasource.url=jdbc:sqlite:db/control_horario.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.sql.init.mode=always
spring.main.web-application-type=servlet
EOF

# schema.sql
cat > "$BACKEND_DIR/src/main/resources/schema.sql" <<'EOF'
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL,
    password TEXT NOT NULL
);

DROP TABLE IF EXISTS fichajes;
CREATE TABLE fichajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT,
    tipo TEXT,
    fecha_hora TEXT
);
EOF

# data.sql
cat > "$BACKEND_DIR/src/main/resources/data.sql" <<'EOF'
INSERT INTO usuarios (usuario, password) VALUES ('Jorge', 'tool16october');
INSERT INTO usuarios (usuario, password) VALUES ('Angelo', 'cucobarsa');
EOF

# Controlador principal
cat > "$BACKEND_DIR/src/main/java/com/proyecto/controlhorario/controller/AuthController.java" <<'EOF'
package com.proyecto.controlhorario.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private JdbcTemplate jdbc;

    record Credenciales(String usuario, String password) {}
    record Fichaje(String usuario, String tipo, String fecha_hora) {}

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Credenciales c) {
        var usuarios = jdbc.queryForList("SELECT * FROM usuarios WHERE usuario=? AND password=?", c.usuario(), c.password());
        if (usuarios.isEmpty()) {
            return Map.of("ok", false, "mensaje", "Credenciales inválidas");
        }
        return Map.of("ok", true, "token", UUID.randomUUID().toString(), "usuario", c.usuario());
    }

    @PostMapping("/fichar")
    public Map<String, Object> fichar(@RequestBody Fichaje f) {
        jdbc.update("INSERT INTO fichajes (usuario, tipo, fecha_hora) VALUES (?, ?, ?)", f.usuario(), f.tipo(), LocalDateTime.now().toString());
        return Map.of("ok", true);
    }

    @GetMapping("/fichajes")
    public List<Map<String, Object>> fichajes() {
        return jdbc.queryForList("SELECT * FROM fichajes ORDER BY id DESC");
    }
}
EOF

# ==========================================================
# FRONTEND - Angular standalone (login + fichaje)
# ==========================================================
echo "⚙️ Generando frontend Angular..."
cd "$(dirname "$FRONTEND_DIR")"
ng new frontend --standalone --routing --style=css --skip-git --skip-install

cd "$FRONTEND_DIR"
npm install

# App Component Angular 20 standalone
cat > "$FRONTEND_DIR/src/app/app.component.ts" <<'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  usuario = '';
  password = '';
  autenticado = false;
  fichajes: any[] = [];

  constructor(private http: HttpClient) {}

  login() {
    this.http.post<any>('http://localhost:8080/api/login', {
      usuario: this.usuario,
      password: this.password
    }).subscribe({
      next: res => {
        if (res.ok) {
          this.autenticado = true;
          this.cargarFichajes();
        } else {
          alert('Credenciales incorrectas');
        }
      },
      error: () => alert('Error de conexión')
    });
  }

  fichar(tipo: string) {
    this.http.post('http://localhost:8080/api/fichar', {
      usuario: this.usuario,
      tipo: tipo
    }).subscribe(() => this.cargarFichajes());
  }

  cargarFichajes() {
    this.http.get<any[]>('http://localhost:8080/api/fichajes').subscribe({
      next: data => this.fichajes = data
    });
  }
}
EOF

cat > "$FRONTEND_DIR/src/app/app.component.html" <<'EOF'
<div class="container">
  <h1>🕒 Control Horario</h1>

  <div *ngIf="!autenticado" class="login">
    <input [(ngModel)]="usuario" placeholder="Usuario" />
    <input [(ngModel)]="password" type="password" placeholder="Contraseña" />
    <button (click)="login()">Iniciar sesión</button>
  </div>

  <div *ngIf="autenticado" class="panel">
    <h2>Bienvenido, {{usuario}}</h2>
    <button (click)="fichar('entrada')">Fichar entrada</button>
    <button (click)="fichar('salida')">Fichar salida</button>

    <h3>Historial de fichajes</h3>
    <table>
      <tr><th>Usuario</th><th>Tipo</th><th>Fecha</th></tr>
      <tr *ngFor="let f of fichajes">
        <td>{{f.usuario}}</td>
        <td>{{f.tipo}}</td>
        <td>{{f.fecha_hora}}</td>
      </tr>
    </table>
  </div>
</div>
EOF

cat > "$FRONTEND_DIR/src/app/app.component.css" <<'EOF'
body { font-family: Arial, sans-serif; background: #f8f9fa; }
.container { text-align: center; padding: 40px; }
input { margin: 5px; padding: 8px; }
button { margin: 5px; padding: 8px 15px; cursor: pointer; }
table { margin: 20px auto; border-collapse: collapse; }
td, th { border: 1px solid #ccc; padding: 5px 10px; }
EOF

echo "=========================================================="
echo "✅ ProyectoControlHorario COMPLETO GENERADO"
echo "----------------------------------------------------------"
echo "📁 Backend:  $BACKEND_DIR"
echo "📁 Frontend: $FRONTEND_DIR"
echo ""
echo "▶️ Ejecutar backend:"
echo "   cd \"$BACKEND_DIR\" && mvn spring-boot:run"
echo ""
echo "▶️ Ejecutar frontend:"
echo "   cd \"$FRONTEND_DIR\" && npm start"
echo ""
echo "💡 Luego abre http://localhost:4200"
echo "=========================================================="
