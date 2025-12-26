import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FichajeService } from '../../../core/services/fichaje.service';
import { AuthService } from '../../../core/services/auth.service';
import { Fichaje } from '../../../core/models/fichaje.model';

@Component({
  selector: 'app-historial',
  standalone: false,
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {
  fichajes: any[] = [];
  loading = true;
  errorMessage = '';
  userRole = '';
  username = '';
  departamento = '';
  paginaActual: number = 0;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  totalFichajes: number = 0;

  constructor(
    private fichajeService: FichajeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = this.authService.getUserData();
    this.userRole = userData?.rol || '';
    this.username = userData?.username || '';
    this.departamento = userData?.departamento || '';
    this.cargarFichajes();
  }

  cargarFichajes(): void {
    this.loading = true;
    this.errorMessage = '';
    
    // Primero contar el total de fichajes
    this.fichajeService.contarFichajesUsuario(this.username, this.departamento).subscribe({
      next: (data) => {
        this.totalFichajes = data.totalFichajesUsuario || 0;
        this.totalPaginas = Math.ceil(this.totalFichajes / this.elementosPorPagina);
        
        // Luego cargar los fichajes de la página actual
        this.fichajeService.listarFichajesUsuario(this.paginaActual, this.elementosPorPagina).subscribe({
          next: (fichajes) => {
            this.fichajes = fichajes;
            this.loading = false;
            
            // Si no hay fichajes y estamos en una página > 0, volver a la última página válida
            if (fichajes.length === 0 && this.paginaActual > 0) {
              this.paginaActual = this.totalPaginas - 1;
              this.cargarFichajes();
            }
          },
          error: (error) => {
            this.errorMessage = 'Error al cargar fichajes';
            this.loading = false;
            console.error('Error:', error);
          }
        });
      },
      error: (error) => {
        this.errorMessage = 'Error al contar fichajes';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  getEstadoClass(fichaje: any): string {
    const aprobado = fichaje.aprobadoEdicion;
    if (!aprobado) {
      return 'original';
    }
    const estadoUpper = String(aprobado).toUpperCase().trim();
    if (estadoUpper === 'PENDIENTE') {
      return 'pendiente';
    } else if (estadoUpper === 'RECHAZADO') {
      return 'rechazado';
    } else if (estadoUpper === 'APROBADO') {
      return 'editado';
    }
    return 'original';
  }

  getEstadoTexto(fichaje: any): string {
    const aprobado = fichaje.aprobadoEdicion;
    if (!aprobado) {
      return '📋 Original';
    }
    const estadoUpper = String(aprobado).toUpperCase().trim();
    if (estadoUpper === 'PENDIENTE') {
      return '⏳ Pendiente';
    } else if (estadoUpper === 'RECHAZADO') {
      return '❌ Rechazado';
    } else if (estadoUpper === 'APROBADO') {
      return '✏️ Editado';
    }
    return '📋 Original';
  }

  editarFichaje(fichaje: any): void {
    const fichajeId = fichaje.id_fichaje || fichaje.id;
    // Redirigir a la página de solicitar edición con el ID del fichaje
    this.router.navigate(['/fichajes/solicitar-edicion'], { 
      queryParams: { fichajeId: fichajeId } 
    });
  }

  generarPaginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarFichajes();
    }
  }

  cambiarPagina(): void {
    this.cargarFichajes();
  }

  cambiarElementosPorPagina(): void {
    this.paginaActual = 0;
    this.totalPaginas = Math.ceil(this.totalFichajes / this.elementosPorPagina);
    this.cargarFichajes();
  }
}
