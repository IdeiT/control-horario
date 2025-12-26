import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared-module';

import { IntegridadRoutingModule } from './integridad-routing-module';
import { VerificarIntegridad } from './verificar-integridad/verificar-integridad';
import { VerificarIntegridadEdiciones } from './verificar-integridad-ediciones/verificar-integridad-ediciones';


@NgModule({
  declarations: [
    VerificarIntegridad,
    VerificarIntegridadEdiciones
  ],
  imports: [
    CommonModule,
    SharedModule,
    IntegridadRoutingModule
  ]
})
export class IntegridadModule { }
