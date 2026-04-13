import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourierService } from '../../../core/services/courier.service';
import { VehicleType } from '../../../core/models/courier.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-courier-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './courier-create.component.html',
  styleUrl: './courier-create.component.css'
})
export class CourierCreateComponent {
  private fb = inject(FormBuilder);
  private courierService = inject(CourierService);
  private router = inject(Router);

  courierForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  vehicleTypes = Object.values(VehicleType);

  constructor() {
    this.courierForm = this.fb.group({
      userId: ['', [Validators.required, Validators.min(1)]],
      vehicleType: [VehicleType.CAR, Validators.required],
      licensePlate: ['', Validators.maxLength(20)],
      phone: ['', [Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      maxWeightKg: ['', [Validators.min(0.01), Validators.max(99999.99)]]
    });
  }

  onSubmit(): void {
    if (this.courierForm.invalid) {
      Object.keys(this.courierForm.controls).forEach(key => {
        this.courierForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    this.courierService.create(this.courierForm.value).subscribe({
      next: (created) => {
        this.success.set(true);
        setTimeout(() => {
          this.router.navigate(['/couriers', created.id]);
        }, 1500);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/couriers']);
  }
}