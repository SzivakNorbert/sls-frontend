import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center" [ngClass]="{'p-3': padding}">
      <div class="spinner" [ngClass]="{'spinner-large': size === 'large'}"></div>
      @if (message) {
        <p class="mt-2 text-muted">{{ message }}</p>
      }
    </div>
  `,
  styles: []
})
export class LoadingSpinnerComponent {
  @Input() size: 'normal' | 'large' = 'normal';
  @Input() message?: string;
  @Input() padding: boolean = true;
}