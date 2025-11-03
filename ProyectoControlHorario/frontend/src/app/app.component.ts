import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  apiUrl = 'http://localhost:8080/api';
  usuario = '';
  password = '';
  autenticado = false;
  fichajes: any[] = [];

  constructor(private http: HttpClient) {}

  login() {
    this.http.post<boolean>(`${this.apiUrl}/login`, { usuario: this.usuario, password: this.password })
      .subscribe(ok => {
        this.autenticado = ok;
        if (ok) {
          this.cargarFichajes();
        } else {
          alert('Credenciales incorrectas');
        }
      });
  }

  fichar(tipo: string) {
    this.http.post(`${this.apiUrl}/fichar`, { usuario: this.usuario, tipo })
      .subscribe(() => this.cargarFichajes());
  }

  cargarFichajes() {
    this.http.get<any[]>(`${this.apiUrl}/fichajes`)
      .subscribe(data => this.fichajes = data);
  }

  salir() {
    this.autenticado = false;
    this.usuario = '';
    this.password = '';
    this.fichajes = [];
  }
}
