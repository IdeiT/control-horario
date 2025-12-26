import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/general/registro`, usuario);
  }

  cambiarPassword(data: { username: string, nuevaPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/general/cambiarPassword`, data);
  }

  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/general/listarUsuarios`);
  }
}
