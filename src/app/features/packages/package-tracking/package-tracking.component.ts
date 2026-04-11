import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PackageService } from '../../../core/services/package.service';
import { Package } from '../../../core/models/package.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';

@Component({
  selector: 'app-package-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent, StatusBadgeComponent],
  templateUrl: './package-tracking.component.html',
  styleUrl: './package-tracking.component.css'
})
export class PackageTrackingComponent {
  private packageService = inject(PackageService);

  trackingNumber = '';
  package = signal<Package | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  search(): void {
    if (!this.trackingNumber.trim()) {
      this.error.set('Kérlek add meg a tracking számot');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.package.set(null);

    this.packageService.getByTrackingNumber(this.trackingNumber).subscribe({
      next: (response) => {
        if (response.success) {
          this.package.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Csomag nem található');
        this.loading.set(false);
      }
    });
  }
}