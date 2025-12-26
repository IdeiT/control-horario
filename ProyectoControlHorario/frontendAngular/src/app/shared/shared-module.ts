import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

// reCAPTCHA
import { NgxCaptchaModule } from 'ngx-captcha';

// Pipes
import { FechaLocalPipe } from './pipes/fecha-local.pipe';

// Components
import { FichajeExitosoDialogComponent } from './components/fichaje-exitoso-dialog/fichaje-exitoso-dialog.component';
import { DepartamentoExitosoDialogComponent } from './components/departamento-exitoso-dialog/departamento-exitoso-dialog.component';
import { UsuarioExitosoDialogComponent } from './components/usuario-exitoso-dialog/usuario-exitoso-dialog.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatSelectModule,
  MatTableModule,
  MatChipsModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatDialogModule
];

@NgModule({
  declarations: [
    FechaLocalPipe,
    FichajeExitosoDialogComponent,
    DepartamentoExitosoDialogComponent,
    UsuarioExitosoDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ...materialModules,
    NgxCaptchaModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ...materialModules,
    NgxCaptchaModule,
    FechaLocalPipe
  ]
})
export class SharedModule { }

