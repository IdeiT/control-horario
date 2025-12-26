import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AprobarSolicitudes } from './aprobar-solicitudes/aprobar-solicitudes';

const routes: Routes = [
  { path: 'aprobar-solicitudes', component: AprobarSolicitudes }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupervisorRoutingModule { }
