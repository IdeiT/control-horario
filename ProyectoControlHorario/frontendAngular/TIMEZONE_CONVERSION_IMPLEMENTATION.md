# Implementación de Conversión de Zonas Horarias UTC ↔ Local

## Resumen
El backend siempre almacena fechas en **UTC+0**. El frontend Angular ahora convierte automáticamente:
- **UTC+0 → Hora Local**: Para mostrar fechas al usuario
- **Hora Local → UTC+0**: Cuando el usuario envía datos al backend

## Archivos Creados

### 1. `src/app/shared/utils/date-utils.ts`
Utilidades para conversión de zonas horarias:

#### `formatearFechaLocal(utcDateString: string): string`
- **Entrada**: Fecha en formato UTC del backend (ej: "2025-12-23T18:01:22")
- **Salida**: Fecha en hora local formateada (ej: "23/12/2025, 15:01:22")
- **Uso**: Convertir fechas UTC a formato legible en zona horaria local

#### `convertirLocalAUTC(localDateString: string): string`
- **Entrada**: Fecha del input datetime-local (ej: "2025-12-23T15:01")
- **Salida**: Fecha en formato UTC para el backend (ej: "2025-12-23T18:01:22")
- **Uso**: Convertir fechas locales a UTC antes de enviar al backend

#### `utcParaInputLocal(utcDateString: string): string`
- **Entrada**: Fecha en formato UTC (ej: "2025-12-23T18:01:22")
- **Salida**: Formato compatible con input datetime-local (ej: "2025-12-23T15:01")
- **Uso**: Pre-rellenar inputs con valores UTC convertidos a local

### 2. `src/app/shared/pipes/fecha-local.pipe.ts`
Pipe Angular para usar en templates:

```typescript
{{ fechaUTC | fechaLocal }}
```

Automáticamente convierte cualquier fecha UTC a hora local formateada.

## Archivos Modificados

### Componentes con Fechas Mostradas (UTC → Local)

#### 1. `historial.html`
- ✅ `{{ fichaje.instanteAnterior | fechaLocal }}`
- ✅ `{{ fichaje.nuevoInstante | fechaLocal }}`
- ✅ `{{ fichaje.solicitudInstante | fechaLocal }}`
- Estados: APROBADO, PENDIENTE, RECHAZADO, null

#### 2. `verificar-integridad.html`
- ✅ `{{ fichaje.fechaHora_original | fechaLocal }}`
- ✅ `{{ fichaje.fechaHora_editado | fechaLocal }}`

#### 3. `verificar-integridad-ediciones.html`
- ✅ `{{ edicion.fechaHora_original | fechaLocal }}`
- ✅ `{{ edicion.fechaHora_editado | fechaLocal }}`

#### 4. `aprobar-solicitudes.html`
- ✅ `{{ solicitud.instante_original | fechaLocal }}`
- ✅ `{{ solicitud.nuevo_instante | fechaLocal }}`

#### 5. `solicitar-edicion.html`
- ✅ `{{ fichaje.fechaHora | fechaLocal }}` (en el select de fichajes)

### Componentes con Envío de Fechas (Local → UTC)

#### 1. `solicitar-edicion.ts`
```typescript
// Importa la función de conversión
import { convertirLocalAUTC } from '../../../shared/utils/date-utils';

// En onSubmit(), convierte antes de enviar
const formValue = { ...this.solicitudForm.value };
formValue.nuevoFechaHora = convertirLocalAUTC(formValue.nuevoFechaHora);
this.fichajeService.solicitarEdicion(formValue).subscribe({...});
```

## Flujo de Datos

### Recibir del Backend (Display)
```
Backend (UTC+0)           Frontend
"2025-12-23T18:01:22" →  Pipe fechaLocal  →  "23/12/2025, 15:01:22"
                                              (Zona horaria local del usuario)
```

### Enviar al Backend (Submit)
```
Frontend (Input Local)    Backend (UTC+0)
"2025-12-23T15:01"    →  convertirLocalAUTC()  →  "2025-12-23T18:01:22"
```

## Registro del Pipe

`shared-module.ts`:
```typescript
import { FechaLocalPipe } from './pipes/fecha-local.pipe';

@NgModule({
  declarations: [FechaLocalPipe],
  exports: [FechaLocalPipe],
  ...
})
```

Todos los módulos que importan `SharedModule` tienen acceso al pipe.

## Verificación

✅ Todas las fechas mostradas usan `| fechaLocal`
✅ Formularios convierten con `convertirLocalAUTC()` antes de enviar
✅ Backend siempre recibe y almacena en UTC+0
✅ Usuario siempre ve su hora local
✅ Sin errores de compilación

## Ejemplo de Uso

### Template (HTML)
```html
<!-- Mostrar fecha -->
<td>{{ fichaje.fechaHora | fechaLocal }}</td>

<!-- Input (el usuario ingresa en su hora local) -->
<input type="datetime-local" formControlName="nuevoFechaHora">
```

### Componente (TS)
```typescript
import { convertirLocalAUTC } from '../../../shared/utils/date-utils';

onSubmit() {
  const formValue = { ...this.form.value };
  // Convertir a UTC antes de enviar
  formValue.nuevoFechaHora = convertirLocalAUTC(formValue.nuevoFechaHora);
  this.service.enviar(formValue).subscribe({...});
}
```

## Notas Importantes

1. **Backend siempre UTC+0**: La base de datos almacena todo en UTC+0
2. **Frontend automático**: El pipe `fechaLocal` maneja la conversión automáticamente
3. **Inputs del usuario**: Siempre usar `convertirLocalAUTC()` antes de enviar al backend
4. **Formato consistente**: Todas las fechas se muestran como "dd/MM/yyyy, HH:mm:ss"
5. **Zona horaria del navegador**: Las conversiones usan la zona horaria configurada en el navegador del usuario
