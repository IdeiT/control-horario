import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared-module';

import { SupervisorRoutingModule } from './supervisor-routing-module';
import { AprobarSolicitudes } from './aprobar-solicitudes/aprobar-solicitudes';


@NgModule({
  declarations: [
    AprobarSolicitudes
  ],
  imports: [
    CommonModule,
    SharedModule,
    SupervisorRoutingModule
  ]
})
export class SupervisorModule { }
