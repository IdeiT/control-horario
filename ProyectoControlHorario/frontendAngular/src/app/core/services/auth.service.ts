import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, UsuarioToken } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<UsuarioToken | null>;
  public currentUser: Observable<UsuarioToken | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const userData = this.getUserData();
    this.currentUserSubject = new BehaviorSubject<UsuarioToken | null>(userData);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UsuarioToken | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/general/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
            const userData = this.getUserData();
            this.currentUserSubject.next(userData);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getUserData(): UsuarioToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        username: payload.username,
        rol: payload.rol,
        departamento: payload.departamento,
        exp: payload.exp
      };
    } catch (e) {
      console.error('Error al decodificar token:', e);
      return null;
    }
  }

  hasRole(roles: string[]): boolean {
    const userData = this.getUserData();
    if (!userData) return false;
    return roles.includes(userData.rol);
  }
}
