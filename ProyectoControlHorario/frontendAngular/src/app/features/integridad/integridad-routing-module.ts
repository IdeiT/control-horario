import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerificarIntegridad } from './verificar-integridad/verificar-integridad';
import { VerificarIntegridadEdiciones } from './verificar-integridad-ediciones/verificar-integridad-ediciones';

const routes: Routes = [
  { path: 'verificar-integridad', component: VerificarIntegridad },
  { path: 'verificar-integridad-ediciones', component: VerificarIntegridadEdiciones }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegridadRoutingModule { }
