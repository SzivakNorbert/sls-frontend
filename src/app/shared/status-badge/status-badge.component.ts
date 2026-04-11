import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="getBadgeClass()">
      {{ getDisplayText() }}
    </span>
  `,
  styles: []
})
export class StatusBadgeComponent {
  @Input() status!: string;
  @Input() type: 'package' | 'delivery' | 'priority' = 'package';

  getBadgeClass(): string {
    const statusLower = this.status?.toLowerCase() || '';

    const classMap: { [key: string]: string } = {
      'created': 'badge-created',
      'assigned': 'badge-assigned',
      'in_transit': 'badge-in-transit',
      'delivered': 'badge-delivered',
      'failed': 'badge-failed',
      'express': 'badge-express',
      'normal': 'badge-normal'
    };

    return classMap[statusLower] || 'badge-normal';
  }

  getDisplayText(): string {
    const translations: { [key: string]: string } = {
      'CREATED': 'Létrehozva',
      'ASSIGNED': 'Hozzárendelve',
      'IN_TRANSIT': 'Szállítás alatt',
      'DELIVERED': 'Kézbesítve',
      'FAILED': 'Sikertelen',
      'EXPRESS': 'Expressz',
      'NORMAL': 'Normál'
    };

    return translations[this.status] || this.status;
  }
}