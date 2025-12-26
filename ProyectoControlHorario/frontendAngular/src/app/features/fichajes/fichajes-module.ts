import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { FichajesRoutingModule } from './fichajes-routing-module';
import { Fichar } from './fichar/fichar';
import { Historial } from './historial/historial';
import { SolicitarEdicion } from './solicitar-edicion/solicitar-edicion';

@NgModule({
  declarations: [
    Fichar,
    Historial,
    SolicitarEdicion
  ],
  imports: [
    SharedModule,
    FichajesRoutingModule
  ]
})
export class FichajesModule { }
