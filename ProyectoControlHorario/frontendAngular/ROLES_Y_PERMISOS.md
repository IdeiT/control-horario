# 🔐 Sistema de Roles y Permisos

## Roles del Sistema

### ✅ **Administrador**

**Permisos:**
- ✅ Puede verificar integridad de fichajes y ediciones de **TODOS los departamentos**
- ✅ Puede crear usuarios, departamentos, cambiar contraseñas
- ❌ **NO ficha**

**Opciones en Dashboard:**
- Crear Usuario
- Crear Departamento
- Ver Todos los Fichajes (todos los departamentos)
- Verificar Integridad (todos los departamentos)
- Verificar Integridad Ediciones (todos los departamentos)
- Aprobar Solicitudes (todos los departamentos)
- Cambiar Contraseña

---

### ✅ **Auditor**

**Permisos:**
- ✅ Pertenece a un departamento
- ✅ Puede verificar integridad de fichajes y ediciones de **SU departamento**
- ❌ **NO ficha**

**Opciones en Dashboard:**
- Ver Fichajes del Departamento
- Verificar Integridad (su departamento)
- Verificar Integridad Ediciones (su departamento)
- Cambiar Contraseña

---

### ✅ **Supervisor**

**Permisos:**
- ✅ Pertenece a un departamento
- ✅ Puede verificar integridad de fichajes y ediciones de **SU departamento**
- ✅ Aprueba/rechaza solicitudes de edición
- ✅ **SÍ ficha**

**Opciones en Dashboard:**
- Fichar
- Mis Fichajes
- Solicitar Edición
- Aprobar Solicitudes (su departamento)
- Verificar Integridad (su departamento)
- Verificar Integridad Ediciones (su departamento)
- Cambiar Contraseña

---

### ✅ **Empleado**

**Permisos:**
- ✅ Pertenece a un departamento
- ✅ **SÍ ficha**
- ❌ **NO puede verificar integridad**

**Opciones en Dashboard:**
- Fichar
- Mis Fichajes
- Solicitar Edición
- Cambiar Contraseña

---

## Implementación Técnica

### Guards en Rutas

```typescript
// Admin: solo Administrador
data: { roles: ['Administrador'] }

// Supervisor: Supervisor y Administrador
data: { roles: ['Supervisor', 'Administrador'] }

// Integridad: Auditor, Supervisor y Administrador
data: { roles: ['Auditor', 'Supervisor', 'Administrador'] }

// Fichajes: Todos menos Auditor y Administrador
data: { roles: ['Empleado', 'Supervisor'] }
```

### Servicios según Rol

**FichajeService:**
- `obtenerFichajes()` → Empleado, Supervisor (propios)
- `obtenerFichajesPorDepartamento()` → Supervisor, Auditor (departamento)
- `obtenerTodosFichajes()` → Administrador (todos)

**IntegridadService:**
- Auditor y Supervisor: verifican su departamento
- Administrador: verifica todos los departamentos

---

## Matriz de Permisos

| Función | Administrador | Auditor | Supervisor | Empleado |
|---------|:-------------:|:-------:|:----------:|:--------:|
| Fichar | ❌ | ❌ | ✅ | ✅ |
| Ver propios fichajes | ❌ | ❌ | ✅ | ✅ |
| Ver fichajes departamento | ✅ (todos) | ✅ | ✅ | ❌ |
| Solicitar edición | ❌ | ❌ | ✅ | ✅ |
| Aprobar solicitudes | ✅ (todos) | ❌ | ✅ | ❌ |
| Verificar integridad | ✅ (todos) | ✅ | ✅ | ❌ |
| Crear usuarios | ✅ | ❌ | ❌ | ❌ |
| Crear departamentos | ✅ | ❌ | ❌ | ❌ |
| Cambiar contraseña | ✅ | ✅ | ✅ | ✅ |

---

## Notas de Seguridad

- Todos los permisos se validan en el **backend** con JWT
- Los guards del frontend son solo **UI/UX** (no seguridad)
- El interceptor JWT envía automáticamente el token
- El backend verifica el rol en cada endpoint
