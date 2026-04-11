import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
       name: 'statusTranslate',
       standalone: true
})
export class StatusTranslatePipe implements PipeTransform {
       private translations: { [key: string]: string } = {
              'CREATED': 'Létrehozva',
              'ASSIGNED': 'Hozzárendelve',
              'IN_TRANSIT': 'Szállítás alatt',
              'DELIVERED': 'Kézbesítve',
              'FAILED': 'Sikertelen',
              'EXPRESS': 'Expressz',
              'NORMAL': 'Normál'
       };

       transform(value: string): string {
              return this.translations[value] || value;
       }
}