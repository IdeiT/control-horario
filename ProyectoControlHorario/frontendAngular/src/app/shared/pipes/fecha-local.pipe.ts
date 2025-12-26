import { Pipe, PipeTransform } from '@angular/core';
import { formatearFechaLocal } from '../utils/date-utils';

/**
 * Pipe para convertir fechas UTC del backend a hora local del navegador
 * Uso: {{ fechaUTC | fechaLocal }}
 */
@Pipe({
  name: 'fechaLocal',
  standalone: false
})
export class FechaLocalPipe implements PipeTransform {
  transform(utcDateString: string | null | undefined): string {
    return formatearFechaLocal(utcDateString);
  }
}
