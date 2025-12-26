import { Component, OnInit, OnDestroy } from '@angular/core';
import { FichajeService } from '../../../core/services/fichaje.service';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioToken } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-fichar',
  standalone: false,
  templateUrl: './fichar.html',
  styleUrl: './fichar.css',
})
export class Fichar implements OnInit, OnDestroy {
  currentTime: string = '';
  currentDate: string = '';
  currentUser: UsuarioToken | null = null;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  loading = false;
  private intervalId: any;

  constructor(
    private fichajeService: FichajeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserData();
    this.updateClock();
    this.intervalId = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateClock(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('es-ES');
    this.currentDate = now.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  fichar(): void {
    this.loading = true;
    this.message = '';
    this.messageType = '';

    this.fichajeService.fichar().subscribe({
      next: (response) => {
        this.loading = false;
        this.messageType = 'success';
        this.message = response.mensaje || '✅ Fichaje registrado correctamente';
        
        if (response.tipo) {
          this.message += ` (${response.tipo})`;
        }
      },
      error: (error) => {
        this.loading = false;
        this.messageType = 'error';
        this.message = error.error?.mensaje || '❌ Error al registrar fichaje';
      }
    });
  }
}
