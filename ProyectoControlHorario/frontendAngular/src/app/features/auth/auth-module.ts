import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { AuthRoutingModule } from './auth-routing-module';
import { Index } from './index/index';
import { Login } from './login/login';

@NgModule({
  declarations: [
    Index,
    Login
  ],
  imports: [
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
