import { Component, OnInit } from '@angular/core';
import { FichajeService } from '../../../core/services/fichaje.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aprobar-solicitudes',
  standalone: false,
  templateUrl: './aprobar-solicitudes.html',
  styleUrl: './aprobar-solicitudes.css'
})
export class AprobarSolicitudes implements OnInit {
  solicitudes: any[] = [];
  totalSolicitudes: number = 0;
  paginaActual: number = 0;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  loading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  departamento: string = '';
  nombreUsuario: string = '';

  constructor(
    private fichajeService: FichajeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = this.authService.getUserData();
    if (userData) {
      this.departamento = userData.departamento || '';
      this.nombreUsuario = `${userData.username} (${userData.rol})`;
      this.cargarSolicitudes();
    }
  }

  cargarSolicitudes(): void {
    if (!this.departamento) {
      this.showMessage('⚠️ No se pudo obtener el departamento del usuario', 'error');
      return;
    }

    this.loading = true;

    // Primero obtener el total
    this.fichajeService.contarSolicitudesTotales(this.departamento).subscribe({
      next: (data) => {
        this.totalSolicitudes = data.totalSolicitudesDepartamento || 0;
        this.totalPaginas = Math.ceil(this.totalSolicitudes / this.elementosPorPagina);

        // Luego obtener la página actual
        this.fichajeService.listarSolicitudesPendientes(this.paginaActual, this.elementosPorPagina).subscribe({
          next: (solicitudes) => {
            this.solicitudes = solicitudes;
            this.loading = false;
            if (solicitudes.length === 0 && this.paginaActual === 0) {
              this.showMessage('ℹ️ No hay solicitudes pendientes', 'success');
            }
          },
          error: (error) => {
            this.loading = false;
            const mensaje = error.error?.msg || 'Error al cargar solicitudes';
            this.showMessage(`❌ ${mensaje}`, 'error');
          }
        });
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('❌ Error al contar solicitudes', 'error');
      }
    });
  }

  aprobarSolicitud(solicitudId: number): void {
    if (!confirm('¿Estás seguro de que deseas aprobar esta solicitud?')) {
      return;
    }

    this.fichajeService.aprobarSolicitud(solicitudId).subscribe({
      next: (response) => {
        this.showMessage(`✅ ${response.msg || 'Solicitud aprobada correctamente'}`, 'success');
        setTimeout(() => this.cargarSolicitudes(), 1000);
      },
      error: (error) => {
        const mensaje = error.error?.msg || 'Error al aprobar solicitud';
        this.showMessage(`❌ ${mensaje}`, 'error');
      }
    });
  }

  rechazarSolicitud(solicitudId: number): void {
    if (!confirm('¿Estás seguro de que deseas RECHAZAR esta solicitud?')) {
      return;
    }

    this.fichajeService.rechazarSolicitud(solicitudId).subscribe({
      next: (response) => {
        this.showMessage(`✅ ${response.msg || 'Solicitud rechazada correctamente'}`, 'success');
        setTimeout(() => this.cargarSolicitudes(), 1000);
      },
      error: (error) => {
        const mensaje = error.error?.msg || 'Error al rechazar solicitud';
        this.showMessage(`❌ ${mensaje}`, 'error');
      }
    });
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina < 0 || nuevaPagina >= this.totalPaginas) return;
    this.paginaActual = nuevaPagina;
    this.cargarSolicitudes();
  }

  showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  volverDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  generarPaginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarSolicitudes();
    }
  }

  cambiarPaginaDirecta(): void {
    this.cargarSolicitudes();
  }

  cambiarElementosPorPagina(): void {
    this.paginaActual = 0;
    this.cargarSolicitudes();
  }
}
