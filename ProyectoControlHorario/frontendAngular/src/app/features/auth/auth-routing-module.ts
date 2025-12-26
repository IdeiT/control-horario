import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Index } from './index/index';
import { Login } from './login/login';

const routes: Routes = [
  {
    path: '',
    component: Index
  },
  {
    path: 'login',
    component: Login
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
