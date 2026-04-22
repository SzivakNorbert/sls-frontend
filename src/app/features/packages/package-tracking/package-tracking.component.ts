import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { PackageService } from '../../../core/services/package.service';
import { Package } from '../../../core/models/package.model';
import { StatusHistory } from '../../../core/models/status-history.model';
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
  history = signal<StatusHistory[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  search(): void {
    const normalizedTrackingNumber = this.trackingNumber.trim();
    if (!normalizedTrackingNumber) {
      this.error.set('Kérlek add meg a tracking számot');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.package.set(null);
    this.history.set([]);

    forkJoin({
      pkg: this.packageService.getByTrackingNumber(normalizedTrackingNumber),
      history: this.packageService.getTrackingHistory(normalizedTrackingNumber)
    }).subscribe({
      next: (result) => {
        const sortedHistory = [...result.history].sort(
          (a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
        );
        this.history.set(sortedHistory);
        const pkg = result.pkg;
        this.package.set(pkg);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
