import { Component, OnInit, OnDestroy } from '@angular/core';
import { FichajeService } from '../../../core/services/fichaje.service';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioToken } from '../../../core/models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { FichajeExitosoDialogComponent } from '../../../shared/components/fichaje-exitoso-dialog/fichaje-exitoso-dialog.component';

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
  fichajeReciente = false; // Para evitar fichajes duplicados
  private intervalId: any;

  constructor(
    private fichajeService: FichajeService,
    private authService: AuthService,
    private dialog: MatDialog
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
    if (this.fichajeReciente) {
      return; // Evitar fichajes duplicados
    }

    this.loading = true;
    this.message = '';
    this.messageType = '';

    this.fichajeService.fichar().subscribe({
      next: (response) => {
        this.loading = false;
        this.messageType = 'success';
        
        // Deshabilitar botón temporalmente
        this.fichajeReciente = true;
        setTimeout(() => {
          this.fichajeReciente = false;
        }, 5000); // 5 segundos
        
        // Mostrar diálogo de éxito
        const ahora = new Date();
        this.dialog.open(FichajeExitosoDialogComponent, {
          width: '500px',
          disableClose: true,
          data: {
            usuario: this.currentUser?.username || '',
            departamento: this.currentUser?.departamento || 'N/A',
            fecha: ahora.toLocaleDateString('es-ES'),
            hora: ahora.toLocaleTimeString('es-ES'),
            tipo: response.tipo || 'Fichaje',
            mensaje: response.mensaje || '✅ Fichaje registrado correctamente'
          }
        });
      },
      error: (error) => {
        this.loading = false;
        this.messageType = 'error';
        this.message = error.error?.mensaje || '❌ Error al registrar fichaje';
      }
    });
  }
}
