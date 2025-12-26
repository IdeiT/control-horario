import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Departamento } from '../models/departamento.model';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  listarDepartamentos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/general/listarDepartamentos`);
  }

  crearDepartamento(nombreDepartamento: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/general/crearDepartamento?nombreDepartamento=${encodeURIComponent(nombreDepartamento)}`, {});
  }
}
