import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PackageService } from '../../../core/services/package.service';
import { PackagePriority } from '../../../core/models/package.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-package-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HeaderComponent, SidebarComponent],
  templateUrl: './package-create.component.html',
  styleUrl: './package-create.component.css'
})
export class PackageCreateComponent {
  private fb = inject(FormBuilder);
  private packageService = inject(PackageService);
  private router = inject(Router);

  packageForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  priorities = Object.values(PackagePriority);

  constructor() {
    this.packageForm = this.fb.group({
      senderName: ['', [Validators.required, Validators.maxLength(100)]],
      receiverName: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      postalCode: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d{4,10}$/)]], weightKg: ['', [Validators.required, Validators.min(0.01), Validators.max(9999.99)]],
      dimensions: ['', Validators.maxLength(50)],
      priority: [PackagePriority.NORMAL, Validators.required],
      notes: ['', Validators.maxLength(1000)]
    });
  }

  onSubmit(): void {
    if (this.packageForm.invalid) {
      Object.keys(this.packageForm.controls).forEach(key => {
        this.packageForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    this.packageService.create(this.packageForm.value).subscribe({
      next: (created) => {
        this.success.set(true);
        setTimeout(() => {
          this.router.navigate(['/packages', created.id]);
        }, 1500);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/packages']);
  }
}