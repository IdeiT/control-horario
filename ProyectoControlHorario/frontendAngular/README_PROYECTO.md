# Frontend Angular - Control Horario

Este es el frontend en Angular 20 para el sistema de Control Horario.

## Estructura del Proyecto

```
frontendAngular/
├── src/
│   ├── app/
│   │   ├── core/                    # Módulo core con servicios, guards, models
│   │   │   ├── guards/              # AuthGuard, RoleGuard
│   │   │   ├── interceptors/        # JwtInterceptor
│   │   │   ├── models/              # Interfaces y modelos
│   │   │   └── services/            # Servicios (auth, fichaje, etc.)
│   │   ├── features/                # Módulos de funcionalidades
│   │   │   ├── auth/                # Login e index
│   │   │   ├── dashboard/           # Panel principal
│   │   │   ├── fichajes/            # Fichar, historial, solicitar edición
│   │   │   ├── admin/               # Crear usuario, departamento, cambiar password
│   │   │   ├── supervisor/          # Aprobar solicitudes
│   │   │   └── integridad/          # Verificar integridad
│   │   └── shared/                  # Componentes compartidos
│   ├── environments/                # Configuración de entorno
│   └── styles.css                   # Estilos globales
├── angular.json
├── package.json
└── README.md
```

## Características

- ✅ Angular 20 con módulos (no standalone)
- ✅ Angular Material para UI
- ✅ Autenticación JWT con interceptor
- ✅ Guards para protección de rutas
- ✅ reCAPTCHA en login
- ✅ Roles: Administrador, Supervisor, Empleado, Auditor
- ✅ Sistema de fichajes con blockchain
- ✅ Solicitud y aprobación de ediciones
- ✅ Verificación de integridad

## Instalación

```bash
cd frontendAngular
npm install
```

## Desarrollo

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

## Build

```bash
ng build --configuration=production
```

## Configuración

Editar `src/environments/environment.ts` para configurar:
- URL del API backend
- Site key de reCAPTCHA

## Rutas Principales

- `/` - Página de inicio
- `/login` - Inicio de sesión
- `/dashboard` - Panel de control
- `/fichajes/fichar` - Registrar fichaje
- `/fichajes/historial` - Ver historial
- `/fichajes/solicitar-edicion` - Solicitar edición
- `/supervisor/aprobar-solicitudes` - Aprobar solicitudes (Supervisor/Admin)
- `/admin/crear-usuario` - Crear usuario (Admin)
- `/admin/crear-departamento` - Crear departamento (Admin)
- `/admin/cambiar-password` - Cambiar contraseña
- `/integridad/verificar-integridad` - Verificar blockchain (Auditor/Admin)
- `/integridad/verificar-integridad-ediciones` - Verificar ediciones (Auditor/Admin)

## Pendientes de Implementación

Algunos componentes tienen implementaciones básicas que necesitan ser completadas:
- Componentes de administración (crear-usuario, crear-departamento, cambiar-password)
- Componente de supervisor (aprobar-solicitudes)
- Componentes de integridad (verificar-integridad, verificar-integridad-ediciones)

Puedes usar los servicios ya creados en `src/app/core/services` para completar la lógica.
