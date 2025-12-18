import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FichajeService } from '../../../core/services/fichaje';
import { AuthService } from '../../../core/services/auth.service';
import { SolicitarEdicionRequest } from '../../../core/models/fichaje.model';
import { FechaLocalPipe } from '../../../shared/pipes/fecha-local-pipe';

@Component({
  selector: 'app-editar-fichaje',
  standalone: true,
  imports: [CommonModule, FormsModule, FechaLocalPipe],
  templateUrl: './editar-fichaje.html',
  styleUrls: ['./editar-fichaje.css']
})
export class EditarFichajeComponent implements OnInit {
  fichajeId:  number | null = null;
  instanteOriginalUTC = '';
  instanteOriginalLocal = '';
  tipoOriginal = '';
  nuevoInstante = '';
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  // ✅ CORRECCIÓN: Crear instancia del pipe
  private fechaLocalPipe = new FechaLocalPipe();

  constructor(
    private fichajeService: FichajeService,
    public authService: AuthService,
    private router: Router
    // ❌ NO inyectar el pipe aquí
  ) {}

  ngOnInit(): void {
    const fichajeData = localStorage.getItem('fichajeParaEditar');
    
    if (fichajeData) {
      try {
        const fichaje = JSON.parse(fichajeData);
        this.fichajeId = fichaje.id;
        this.tipoOriginal = fichaje.tipo;
        
        // fichaje.instante viene como "17/12/2025, 19:41:25" (ya convertido a local)
        // Pero debemos verificar si viene del backend en formato UTC
        
        console.log('📥 Instante recibido del localStorage:', fichaje.instante);
        
        // ✅ Si viene en formato "DD/MM/YYYY, HH:mm:ss" → ya está en local
        // ✅ Si viene en formato "YYYY-MM-DD HH: mm:ss" → hay que convertir
        if (fichaje.instante. includes(',')) {
          // Ya está en formato local:  "17/12/2025, 19:41:25"
          this.instanteOriginalLocal = fichaje.instante;
          this.nuevoInstante = this.convertirLocalToDatetimeLocal(fichaje.instante);
        } else {
          // Está en formato UTC del backend: "2025-12-17 18:41:25"
          this.instanteOriginalUTC = fichaje.instante;
          this.instanteOriginalLocal = this.fechaLocalPipe.transform(fichaje.instante);
          this.nuevoInstante = this.convertirUTCToDatetimeLocal(fichaje.instante);
        }
        
        console.log('🕐 Instante en hora local:', this.instanteOriginalLocal);
        console.log('📅 Valor para input datetime-local:', this.nuevoInstante);
        
      } catch (error) {
        console.error('Error al parsear fichaje:', error);
        this.errorMessage = 'Error al cargar datos del fichaje';
      }
    } else {
      this.errorMessage = 'No se encontraron datos del fichaje';
    }
  }

  /**
   * Convierte del formato local "17/12/2025, 19:41:25"
   * a formato datetime-local "2025-12-17T19:41"
   */
  convertirLocalToDatetimeLocal(fechaLocal: string): string {
    try {
      const partes = fechaLocal.split(', ');
      const [dia, mes, anio] = partes[0].split('/');
      const [hora, minuto] = partes[1].split(':');
      
      return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T${hora.padStart(2, '0')}:${minuto.padStart(2, '0')}`;
    } catch (error) {
      console.error('Error al convertir fecha local:', error);
      return '';
    }
  }

  /**
   * Convierte del formato UTC backend "2025-12-17 18:41:25"
   * a formato datetime-local "2025-12-17T19:41" (en hora local)
   */
  convertirUTCToDatetimeLocal(fechaUTC: string): string {
    try {
      // Convertir "2025-12-17 18:41:25" (UTC) a Date
      const isoString = fechaUTC.replace(' ', 'T') + 'Z';
      const fecha = new Date(isoString);
      
      if (isNaN(fecha.getTime())) {
        console.error('Fecha UTC inválida:', fechaUTC);
        return '';
      }
      
      // Obtener componentes en hora local
      const anio = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const dia = String(fecha.getDate()).padStart(2, '0');
      const hora = String(fecha.getHours()).padStart(2, '0');
      const minuto = String(fecha.getMinutes()).padStart(2, '0');
      
      return `${anio}-${mes}-${dia}T${hora}:${minuto}`;
    } catch (error) {
      console.error('Error al convertir fecha UTC:', error);
      return '';
    }
  }

  /**
   * Convierte de datetime-local "2025-12-17T19:41" a UTC "2025-12-17 18:41:00"
   */
  convertirLocalAUTC(instanteLocal: string): string {
    if (!instanteLocal) return '';
    
    try {
      // El input datetime-local devuelve:  "2025-12-17T19:41"
      // JavaScript lo interpreta como hora LOCAL del navegador
      const fechaLocal = new Date(instanteLocal);
      
      if (isNaN(fechaLocal.getTime())) {
        console.error('Fecha inválida:', instanteLocal);
        return '';
      }
      
      // Convertir a UTC usando toISOString() y formatear
      const isoUTC = fechaLocal.toISOString(); // "2025-12-17T18:41:00.123Z"
      
      // Formato para el backend: "YYYY-MM-DD HH: mm:ss"
      const instanteUTC = isoUTC.replace('T', ' ').substring(0, 19);
      
      console.log('🕐 Hora local ingresada:', fechaLocal. toLocaleString('es-ES'));
      console.log('🌍 Hora UTC (para backend):', instanteUTC);
      
      return instanteUTC;
    } catch (error) {
      console.error('Error al convertir a UTC:', error);
      return '';
    }
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.fichajeId) {
      this.errorMessage = '⚠️ No se ha seleccionado un fichaje válido';
      return;
    }

    if (!this.nuevoInstante) {
      this.errorMessage = '⚠️ Por favor selecciona una fecha y hora';
      return;
    }

    this.isLoading = true;

    // Convertir a UTC antes de enviar
    const nuevoInstanteUTC = this.convertirLocalAUTC(this.nuevoInstante);

    if (! nuevoInstanteUTC) {
      this.errorMessage = '❌ Fecha inválida';
      this.isLoading = false;
      return;
    }

    const request: SolicitarEdicionRequest = {
      id_fichaje: this.fichajeId,
      nuevoInstante: nuevoInstanteUTC
    };

    console.log('📤 Enviando solicitud de edición:', request);

    this.fichajeService.solicitarEdicion(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.msg || '✅ Solicitud de edición registrada correctamente.  Redirigiendo... ';
        
        localStorage.removeItem('fichajeParaEditar');
        
        setTimeout(() => {
          this.router.navigate(['/fichajes']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al solicitar edición:', error);
        
        if (error.error?.msg) {
          this.errorMessage = error.error.msg;
        } else {
          this.errorMessage = '❌ Error al solicitar edición';
        }
      }
    });
  }

  cancelar(): void {
    localStorage.removeItem('fichajeParaEditar');
    this.router.navigate(['/fichajes']);
  }
}