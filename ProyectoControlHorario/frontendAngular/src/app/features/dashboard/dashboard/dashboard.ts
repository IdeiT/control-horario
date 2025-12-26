import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioToken } from '../../../core/models/usuario.model';

interface DashboardOption {
  title: string;
  description: string;
  emoji: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  currentUser: UsuarioToken | null = null;
  availableOptions: DashboardOption[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserData();
    if (this.currentUser) {
      this.loadAvailableOptions(this.currentUser.rol);
    }
  }

  loadAvailableOptions(rol: string): void {
    const allOptions: Record<string, DashboardOption[]> = {
      'Administrador': [
        {
          title: 'Registrar Usuario',
          description: 'Crear nuevos usuarios',
          emoji: '👤',
          route: '/admin/crear-usuario'
        },
        {
          title: 'Crear Departamento',
          description: 'Agregar nuevos departamentos',
          emoji: '🏢',
          route: '/admin/crear-departamento'
        },
        {
          title: 'Cambiar Contraseña',
          description: 'Cambiar contraseña de usuarios',
          emoji: '🔑',
          route: '/admin/cambiar-password'
        },
        {
          title: 'Verificar Integridad',
          description: 'Comprobar autenticidad de fichajes',
          emoji: '🔐',
          route: '/integridad/verificar-integridad'
        },
        {
          title: 'Verificar Integridad Ediciones',
          description: 'Comprobar blockchain de ediciones',
          emoji: '🔒',
          route: '/integridad/verificar-integridad-ediciones'
        }
      ],
      'Auditor': [
        {
          title: 'Verificar Integridad',
          description: 'Comprobar autenticidad de fichajes',
          emoji: '🔐',
          route: '/integridad/verificar-integridad'
        },
        {
          title: 'Verificar Integridad Ediciones',
          description: 'Comprobar blockchain de ediciones',
          emoji: '🔒',
          route: '/integridad/verificar-integridad-ediciones'
        }
      ],
      'Supervisor': [
        {
          title: 'Fichar',
          description: 'Registra tu entrada o salida',
          emoji: '⏰',
          route: '/fichajes/fichar'
        },
        {
          title: 'Ver Fichajes',
          description: 'Consulta tu historial',
          emoji: '📋',
          route: '/fichajes/historial'
        },
        {
          title: 'Aprobar Solicitudes',
          description: 'Revisar ediciones pendientes',
          emoji: '✅',
          route: '/supervisor/aprobar-solicitudes'
        },
        {
          title: 'Verificar Integridad Fichajes',
          description: 'Comprobar blockchain de fichajes',
          emoji: '🔐',
          route: '/integridad/verificar-integridad'
        },
        {
          title: 'Verificar Integridad Ediciones',
          description: 'Comprobar blockchain de ediciones',
          emoji: '🔒',
          route: '/integridad/verificar-integridad-ediciones'
        }
      ],
      'Empleado': [
        {
          title: 'Fichar',
          description: 'Registra tu entrada o salida',
          emoji: '⏰',
          route: '/fichajes/fichar'
        },
        {
          title: 'Ver Fichajes',
          description: 'Consulta tu historial',
          emoji: '📋',
          route: '/fichajes/historial'
        }
      ]
    };

    this.availableOptions = allOptions[rol] || [];
  }

  logout(): void {
    this.authService.logout();
  }
}
