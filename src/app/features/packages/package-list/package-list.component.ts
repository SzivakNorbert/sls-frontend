import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PackageService } from '../../../core/services/package.service';
import { AuthService } from '../../../core/services/auth.service';
import { Package, PackageStatus, PackagePriority } from '../../../core/models/package.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-package-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    HeaderComponent,
    SidebarComponent,
    StatusBadgeComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './package-list.component.html',
  styleUrl: './package-list.component.css'
})
export class PackageListComponent implements OnInit {
  private packageService = inject(PackageService);
  private authService = inject(AuthService);

  packages = signal<Package[]>([]);
  filteredPackages = signal<Package[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  isAdmin = signal(false);

  // Filters
  searchTerm = signal('');
  statusFilter = signal<string>('ALL');
  priorityFilter = signal<string>('ALL');

  statusOptions = ['ALL', 'CREATED', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'FAILED'];
  priorityOptions = ['ALL', 'NORMAL', 'EXPRESS'];

  ngOnInit(): void {
    this.isAdmin.set(this.authService.isAdmin());
    this.loadPackages();
  }

  loadPackages(): void {
    this.loading.set(true);
    this.error.set(null);

    this.packageService.getAll().subscribe({
      next: (packages) => {
        this.packages.set(packages);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    let filtered = this.packages();

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(p =>
        p.trackingNumber.toLowerCase().includes(search) ||
        p.receiverName.toLowerCase().includes(search) ||
        p.city.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (this.statusFilter() !== 'ALL') {
      filtered = filtered.filter(p => p.status === this.statusFilter());
    }

    // Priority filter
    if (this.priorityFilter() !== 'ALL') {
      filtered = filtered.filter(p => p.priority === this.priorityFilter());
    }

    this.filteredPackages.set(filtered);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.applyFilters();
  }

  onStatusFilterChange(value: string): void {
    this.statusFilter.set(value);
    this.applyFilters();
  }

  onPriorityFilterChange(value: string): void {
    this.priorityFilter.set(value);
    this.applyFilters();
  }
}