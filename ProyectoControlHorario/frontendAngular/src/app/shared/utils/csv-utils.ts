/**
 * Convierte un array de objetos a formato CSV
 */
export function convertirACSV(datos: any[], columnas: { header: string; key: string; transform?: (value: any, item?: any) => string }[]): string {
  if (!datos || datos.length === 0) {
    return '';
  }

  // Crear la fila de encabezados
  const headers = columnas.map(col => col.header).join(',');
  
  // Crear las filas de datos
  const filas = datos.map(item => {
    return columnas.map(col => {
      const valorOriginal = item[col.key];
      let valor = valorOriginal;
      
      // Aplicar transformación si existe. Pasamos también el item completo para transformaciones dependientes de la fila.
      if (col.transform) {
        // Algunos transform esperan sólo el valor, otros el valor y la fila; soportamos ambas formas.
        try {
          valor = col.transform.length >= 2 ? col.transform(valorOriginal, item) : col.transform(valorOriginal);
        } catch (e) {
          // En caso de error en la transformación, fallback al valor original
          console.error('Error en transform CSV para columna', col.header, e);
          valor = valorOriginal;
        }
      }
      
      // Escapar comillas y envolver en comillas si contiene coma, salto de línea o comillas
      if (valor === null || valor === undefined) {
        return '';
      }
      
      const valorString = String(valor);
      if (valorString.includes(',') || valorString.includes('\n') || valorString.includes('"')) {
        return `"${valorString.replace(/"/g, '""')}"`;
      }
      
      return valorString;
    }).join(',');
  });
  
  return [headers, ...filas].join('\n');
}

/**
 * Descarga un contenido CSV como archivo
 */
export function descargarCSV(contenidoCSV: string, nombreArchivo: string): void {
  // Agregar BOM para que Excel reconozca UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + contenidoCSV], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', nombreArchivo);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Genera un nombre de archivo con fecha y hora actual
 */
export function generarNombreArchivoCSV(prefijo: string): string {
  const ahora = new Date();
  const fecha = ahora.toISOString().split('T')[0]; // YYYY-MM-DD
  const hora = ahora.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
  return `${prefijo}_${fecha}_${hora}.csv`;
}
