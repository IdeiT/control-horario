import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    
    if (this.authService.hasRole(requiredRoles)) {
      return true;
    }
    
    alert('⚠️ No tienes permisos para acceder a esta página');
    this.router.navigate(['/dashboard']);
    return false;
  }
}
