import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntegridadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  verificarIntegridadFichajes(departamento: string, pagina: number = 0, elementosPorPagina: number = 10): Observable<any[]> {
    const params = new HttpParams()
      .set('departamento', departamento)
      .set('pagina', pagina.toString())
      .set('elementosPorPagina', elementosPorPagina.toString());
    return this.http.get<any[]>(`${this.apiUrl}/verificarIntegridadFichajes`, { params });
  }

  contarFichajesTotales(departamento: string): Observable<{ totalFichajesDepartamento: number }> {
    const params = new HttpParams().set('departamento', departamento);
    return this.http.get<{ totalFichajesDepartamento: number }>(`${this.apiUrl}/contarFichajesTotales`, { params });
  }

  verificarIntegridadEdiciones(departamento: string, pagina: number = 0, elementosPorPagina: number = 10): Observable<any[]> {
    const params = new HttpParams()
      .set('departamento', departamento)
      .set('pagina', pagina.toString())
      .set('elementosPorPagina', elementosPorPagina.toString());
    return this.http.get<any[]>(`${this.apiUrl}/verificarIntegridadEdiciones`, { params });
  }

  contarEdicionesTotales(departamento: string): Observable<{ totalEdicionesDepartamento: number }> {
    const params = new HttpParams().set('departamento', departamento);
    return this.http.get<{ totalEdicionesDepartamento: number }>(`${this.apiUrl}/contarEdicionesTotales`, { params });
  }
}
