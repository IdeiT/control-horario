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

  crearUsuario(usuario: Usuario): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiUrl}/general/registro`, usuario);
  }

  cambiarPassword(data: { username: string, nuevaPassword: string }): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiUrl}/general/cambiarPassword`, data);
  }

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/general/listarUsuarios`);
  }
}
