import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearUsuario } from './crear-usuario/crear-usuario';
import { CrearDepartamento } from './crear-departamento/crear-departamento';
import { CambiarPassword } from './cambiar-password/cambiar-password';

const routes: Routes = [
  { path: 'crear-usuario', component: CrearUsuario },
  { path: 'crear-departamento', component: CrearDepartamento },
  { path: 'cambiar-password', component: CambiarPassword }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
