import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard-module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'fichajes',
    loadChildren: () => import('./features/fichajes/fichajes-module').then(m => m.FichajesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Administrador'] }
  },
  {
    path: 'supervisor',
    loadChildren: () => import('./features/supervisor/supervisor-module').then(m => m.SupervisorModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Supervisor', 'Administrador'] }
  },
  {
    path: 'integridad',
    loadChildren: () => import('./features/integridad/integridad-module').then(m => m.IntegridadModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Auditor', 'Supervisor', 'Administrador'] }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
