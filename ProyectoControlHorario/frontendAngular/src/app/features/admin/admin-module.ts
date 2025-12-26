import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared-module';

import { AdminRoutingModule } from './admin-routing-module';
import { CrearUsuario } from './crear-usuario/crear-usuario';
import { CrearDepartamento } from './crear-departamento/crear-departamento';
import { CambiarPassword } from './cambiar-password/cambiar-password';


@NgModule({
  declarations: [
    CrearUsuario,
    CrearDepartamento,
    CambiarPassword
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
