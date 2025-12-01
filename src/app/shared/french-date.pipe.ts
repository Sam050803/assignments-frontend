import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'frenchDate',
  standalone: true
})
export class FrenchDatePipe implements PipeTransform {
  private months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  transform(value: Date | string, format: 'short' | 'long' = 'short'): string {
    if (!value) return '';
    
    const date = typeof value === 'string' ? new Date(value) : value;
    
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    if (format === 'long') {
      return `${day} ${this.months[month]} ${year}`;
    } else {
      // Format court: dd/MM/yyyy
      const dayStr = day.toString().padStart(2, '0');
      const monthStr = (month + 1).toString().padStart(2, '0');
      return `${dayStr}/${monthStr}/${year}`;
    }
  }
}

