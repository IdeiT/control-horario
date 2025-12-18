import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FichajeService } from '../../../core/services/fichaje';
import { AuthService } from '../../../core/services/auth.service';
import { SolicitudEdicion } from '../../../core/models/fichaje.model';
import { FechaLocalPipe } from '../../../shared/pipes/fecha-local-pipe';

@Component({
  selector: 'app-aprobar-solicitudes',
  standalone: true,
  imports: [CommonModule, FechaLocalPipe],
  templateUrl: './aprobar-solicitudes.html',
  styleUrls: ['./aprobar-solicitudes.css']
})
export class AprobarSolicitudesComponent implements OnInit {
  solicitudes: SolicitudEdicion[] = [];
  paginaActual = 0;
  elementosPorPagina = 5;
  hayMasPaginas = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fichajeService: FichajeService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🔄 Iniciando componente AprobarSolicitudes');
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.isLoading = true;
    this. errorMessage = '';

    console.log(`📡 Cargando solicitudes - Página:  ${this.paginaActual}, Elementos:  ${this.elementosPorPagina}`);

    this.fichajeService.listarSolicitudes(this.paginaActual, this.elementosPorPagina).subscribe({
      next: (solicitudes) => {
        this.isLoading = false;
        console.log('✅ Solicitudes recibidas:', solicitudes);
        this.solicitudes = solicitudes;
        this.hayMasPaginas = solicitudes.length === this.elementosPorPagina;
        
        if (solicitudes.length === 0) {
          console.log('ℹ️ No hay solicitudes en este momento');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ Error al cargar solicitudes:', error);
        console.error('Status:', error.status);
        console.error('Error completo:', error);
        
        // Mensajes de error más específicos
        if (error. status === 0) {
          this.errorMessage = '❌ No se puede conectar con el servidor.  Verifica que el backend esté corriendo.';
        } else if (error.status === 401) {
          this.errorMessage = '❌ No estás autorizado.  Tu sesión puede haber expirado.';
          setTimeout(() => {
            this.authService.logout();
          }, 2000);
        } else if (error.status === 403) {
          this.errorMessage = '❌ No tienes permisos para ver las solicitudes.';
        } else if (error.status === 404) {
          this.errorMessage = '❌ Endpoint no encontrado. Verifica la URL del backend.';
        } else if (error.error?.mensaje || error.error?.msg) {
          this.errorMessage = error.error. mensaje || error.error.msg;
        } else {
          this. errorMessage = `❌ Error al cargar solicitudes (${error.status})`;
        }
      }
    });
  }

  aprobarSolicitud(solicitudId: number): void {
    if (!confirm('¿Estás seguro de que deseas aprobar esta solicitud?')) {
      return;
    }

    console.log('✅ Aprobando solicitud ID:', solicitudId);

    this.fichajeService. aprobarSolicitud(solicitudId).subscribe({
      next: (response) => {
        console.log('✅ Solicitud aprobada:', response);
        alert(response.msg || '✅ Solicitud aprobada correctamente');
        this.cargarSolicitudes();
      },
      error: (error) => {
        console.error('❌ Error al aprobar solicitud:', error);
        alert(error.error?.msg || '❌ Error al aprobar solicitud');
      }
    });
  }

  rechazarSolicitud(solicitudId: number): void {
    if (!confirm('¿Estás seguro de que deseas RECHAZAR esta solicitud?')) {
      return;
    }

    console.log('❌ Rechazando solicitud ID:', solicitudId);

    this.fichajeService.rechazarSolicitud(solicitudId).subscribe({
      next: (response) => {
        console.log('✅ Solicitud rechazada:', response);
        alert(response.msg || '✅ Solicitud rechazada correctamente');
        this.cargarSolicitudes();
      },
      error: (error) => {
        console.error('❌ Error al rechazar solicitud:', error);
        alert(error.error?. msg || '❌ Error al rechazar solicitud');
      }
    });
  }

  getEstadoClass(estado: string): string {
    const estadoUpper = estado.toUpperCase();
    if (estadoUpper === 'APROBADO') return 'estado-aprobado';
    if (estadoUpper === 'RECHAZADO') return 'estado-rechazado';
    if (estadoUpper === 'PENDIENTE') return 'estado-pendiente';
    return '';
  }

  paginaAnterior(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.cargarSolicitudes();
    }
  }

  paginaSiguiente(): void {
    if (this.hayMasPaginas) {
      this.paginaActual++;
      this.cargarSolicitudes();
    }
  }

  cambiarElementosPorPagina(event: any): void {
    this.elementosPorPagina = parseInt(event.target.value);
    this.paginaActual = 0;
    this.cargarSolicitudes();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}