/**
 * Utilidades para conversión de fechas entre UTC+0 (backend) y hora local del navegador
 */

/**
 * Convierte una fecha UTC+0 del backend a hora local del navegador para mostrar al usuario
 * @param utcDateString Fecha en formato UTC del backend (ej: "2025-12-23T18:01:22")
 * @returns Fecha formateada en hora local (ej: "23/12/2025, 15:01:22")
 */
export function formatearFechaLocal(utcDateString: string | null | undefined): string {
  if (!utcDateString) return 'N/A';
  
  try {
    // El backend envía fechas en UTC sin 'Z', hay que añadirla
    const fechaUTC = utcDateString.endsWith('Z') ? utcDateString : `${utcDateString}Z`;
    const fecha = new Date(fechaUTC);
    
    if (isNaN(fecha.getTime())) {
      return 'Fecha inválida';
    }
    
    // Formatear en hora local del navegador
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    
    return `${dia}/${mes}/${anio}, ${horas}:${minutos}:${segundos}`;
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Error en fecha';
  }
}

/**
 * Convierte una fecha/hora local del navegador a UTC+0 para enviar al backend
 * @param localDateString Fecha en formato local (ej: "2025-12-23T15:01:22" del input datetime-local)
 * @returns Fecha en formato UTC sin 'Z' para el backend (ej: "2025-12-23T18:01:22")
 */
export function convertirLocalAUTC(localDateString: string): string {
  if (!localDateString) return '';
  
  try {
    // Crear fecha asumiendo que es hora local
    const fechaLocal = new Date(localDateString);
    
    if (isNaN(fechaLocal.getTime())) {
      return '';
    }
    
    // Convertir a UTC
    const anio = fechaLocal.getUTCFullYear();
    const mes = (fechaLocal.getUTCMonth() + 1).toString().padStart(2, '0');
    const dia = fechaLocal.getUTCDate().toString().padStart(2, '0');
    const horas = fechaLocal.getUTCHours().toString().padStart(2, '0');
    const minutos = fechaLocal.getUTCMinutes().toString().padStart(2, '0');
    const segundos = fechaLocal.getUTCSeconds().toString().padStart(2, '0');
    
    return `${anio}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
  } catch (error) {
    console.error('Error al convertir fecha a UTC:', error);
    return '';
  }
}

/**
 * Convierte una fecha UTC del backend a formato para input datetime-local (hora local)
 * @param utcDateString Fecha UTC del backend
 * @returns Fecha en formato para input datetime-local en hora local
 */
export function utcParaInputLocal(utcDateString: string | null | undefined): string {
  if (!utcDateString) return '';
  
  try {
    const fechaUTC = utcDateString.endsWith('Z') ? utcDateString : `${utcDateString}Z`;
    const fecha = new Date(fechaUTC);
    
    if (isNaN(fecha.getTime())) {
      return '';
    }
    
    // Formatear para input datetime-local (YYYY-MM-DDTHH:mm)
    const anio = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    
    return `${anio}-${mes}-${dia}T${horas}:${minutos}`;
  } catch (error) {
    console.error('Error al convertir UTC para input:', error);
    return '';
  }
}
