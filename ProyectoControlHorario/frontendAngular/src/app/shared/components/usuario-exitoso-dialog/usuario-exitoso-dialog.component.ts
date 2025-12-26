import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface UsuarioDialogData {
  username: string;
  rol: string;
  departamento?: string;
}

@Component({
  selector: 'app-usuario-exitoso-dialog',
  standalone: false,
  templateUrl: './usuario-exitoso-dialog.component.html',
  styleUrl: './usuario-exitoso-dialog.component.css'
})
export class UsuarioExitosoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UsuarioExitosoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioDialogData
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
