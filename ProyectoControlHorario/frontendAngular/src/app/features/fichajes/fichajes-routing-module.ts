import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Fichar } from './fichar/fichar';
import { Historial } from './historial/historial';
import { SolicitarEdicion } from './solicitar-edicion/solicitar-edicion';

const routes: Routes = [
  {
    path: 'fichar',
    component: Fichar
  },
  {
    path: 'historial',
    component: Historial
  },
  {
    path: 'solicitar-edicion',
    component: SolicitarEdicion
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FichajesRoutingModule { }
