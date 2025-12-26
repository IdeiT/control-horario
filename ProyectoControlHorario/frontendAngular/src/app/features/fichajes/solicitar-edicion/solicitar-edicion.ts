import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FichajeService } from '../../../core/services/fichaje.service';
import { Fichaje } from '../../../core/models/fichaje.model';
import { convertirLocalAUTC } from '../../../shared/utils/date-utils';

@Component({
  selector: 'app-solicitar-edicion',
  standalone: false,
  templateUrl: './solicitar-edicion.html',
  styleUrl: './solicitar-edicion.css',
})
export class SolicitarEdicion implements OnInit {
  fichajes: Fichaje[] = [];
  solicitudForm: FormGroup;
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private fichajeService: FichajeService
  ) {
    this.solicitudForm = this.fb.group({
      fichajeId: ['', Validators.required],
      nuevoFechaHora: ['', Validators.required],
      motivo: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.cargarFichajes();
  }

  cargarFichajes(): void {
    this.fichajeService.obtenerFichajes().subscribe({
      next: (data) => {
        this.fichajes = data;
      },
      error: (error) => {
        this.message = 'Error al cargar fichajes';
        this.messageType = 'error';
      }
    });
  }

  onSubmit(): void {
    if (this.solicitudForm.invalid) {
      this.message = '⚠️ Por favor completa todos los campos correctamente';
      this.messageType = 'error';
      return;
    }

    this.loading = true;
    this.message = '';

    // Convertir la fecha local del usuario a UTC antes de enviar al backend
    const formValue = { ...this.solicitudForm.value };
    formValue.nuevoFechaHora = convertirLocalAUTC(formValue.nuevoFechaHora);

    this.fichajeService.solicitarEdicion(formValue).subscribe({
      next: (response) => {
        this.loading = false;
        this.messageType = 'success';
        this.message = response.msg || response.mensaje || '✅ Solicitud enviada correctamente';
        this.solicitudForm.reset();
      },
      error: (error) => {
        this.loading = false;
        this.messageType = 'error';
        this.message = error.error?.msg || error.error?.mensaje || '❌ Error al enviar solicitud';
      }
    });
  }
}
