import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface FichajeDialogData {
  usuario: string;
  departamento: string;
  fecha: string;
  hora: string;
  tipo: string;
  mensaje: string;
}

@Component({
  selector: 'app-fichaje-exitoso-dialog',
  standalone: false,
  templateUrl: './fichaje-exitoso-dialog.component.html',
  styleUrl: './fichaje-exitoso-dialog.component.css'
})
export class FichajeExitosoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FichajeExitosoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FichajeDialogData
  ) {
    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
      this.cerrar();
    }, 3000);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
