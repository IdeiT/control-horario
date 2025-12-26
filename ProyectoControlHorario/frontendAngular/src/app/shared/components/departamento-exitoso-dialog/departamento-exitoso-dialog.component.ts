import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DepartamentoDialogData {
  nombre: string;
  baseDatos: string;
  estado: string;
}

@Component({
  selector: 'app-departamento-exitoso-dialog',
  standalone: false,
  templateUrl: './departamento-exitoso-dialog.component.html',
  styleUrl: './departamento-exitoso-dialog.component.css'
})
export class DepartamentoExitosoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DepartamentoExitosoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DepartamentoDialogData
  ) {
    // Auto-cerrar después de 4 segundos
    setTimeout(() => {
      this.cerrar();
    }, 4000);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
