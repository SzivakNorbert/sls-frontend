import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
       name: 'roleTranslate',
       standalone: true
})
export class RoleTranslatePipe implements PipeTransform {
       private translations: { [key: string]: string } = {
              'ADMIN': 'Adminisztrátor',
              'COURIER': 'Futár'
       };

       transform(value: string): string {
              return this.translations[value] || value;
       }
}