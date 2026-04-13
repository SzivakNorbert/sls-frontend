import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PackageService } from '../../../core/services/package.service';
import { Package } from '../../../core/models/package.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    SidebarComponent,
    StatusBadgeComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.css'
})
export class PackageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private packageService = inject(PackageService);

  package = signal<Package | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPackage(+id);
    }
  }

  loadPackage(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.packageService.getById(id).subscribe({
      next: (pkg) => {
        this.package.set(pkg);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/packages']);
  }
}