import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PackageService } from '../../../core/services/package.service';
import { CourierService } from '../../../core/services/courier.service';
import { Package, PackageStatus } from '../../../core/models/package.model';
import { Courier } from '../../../core/models/courier.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-package-assign',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './package-assign.component.html',
  styleUrl: './package-assign.component.css'
})
export class PackageAssignComponent implements OnInit {
  private fb = inject(FormBuilder);
  private packageService = inject(PackageService);
  private courierService = inject(CourierService);
  private router = inject(Router);

  assignForm: FormGroup;
  packages = signal<Package[]>([]);
  couriers = signal<Courier[]>([]);
  loading = signal(true);
  submitting = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  constructor() {
    this.assignForm = this.fb.group({
      packageId: ['', Validators.required],
      courierId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    forkJoin({
      packages: this.packageService.getAll(),
      couriers: this.courierService.getAll()
    }).subscribe({
      next: (result) => {
        // Only show CREATED packages
        const allPackages = result.packages; // already Package[]
        this.packages.set(allPackages.filter((p) => p.status === PackageStatus.CREATED));

        // Only show active couriers
        const allCouriers = result.couriers; // already Courier[]
        this.couriers.set(allCouriers.filter((c) => c.isActive));

        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.assignForm.invalid) {
      return;
    }

    this.submitting.set(true);
    this.error.set(null);
    this.success.set(false);

    this.packageService.assignCourier(this.assignForm.value).subscribe({
      next: () => {
        this.success.set(true);
        setTimeout(() => {
          this.router.navigate(['/deliveries']);
        }, 1500);
      },
      error: (err) => {
        this.error.set(err.message);
        this.submitting.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/packages']);
  }
}