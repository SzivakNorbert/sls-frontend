import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DeliveryService } from '../../../core/services/delivery.service';
import { Delivery, DeliveryStatus } from '../../../core/models/delivery.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-my-deliveries',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    HeaderComponent,
    SidebarComponent,
    StatusBadgeComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './my-deliveries.component.html',
  styleUrl: './my-deliveries.component.css'
})
export class MyDeliveriesComponent implements OnInit {
  private deliveryService = inject(DeliveryService);
  private fb = inject(FormBuilder);

  deliveries = signal<Delivery[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // Update Status Modal
  selectedDelivery = signal<Delivery | null>(null);
  updateForm: FormGroup;
  updating = signal(false);
  updateSuccess = signal(false);

  availableStatuses = [
    DeliveryStatus.ASSIGNED,
    DeliveryStatus.IN_TRANSIT,
    DeliveryStatus.DELIVERED,
    DeliveryStatus.FAILED
  ];

  constructor() {
    this.updateForm = this.fb.group({
      newStatus: ['', Validators.required],
      deliveryNotes: ['']
    });

    // Watch status changes to make notes required for FAILED
    this.updateForm.get('newStatus')?.valueChanges.subscribe(status => {
      const notesControl = this.updateForm.get('deliveryNotes');
      if (status === DeliveryStatus.FAILED) {
        notesControl?.setValidators([Validators.required, Validators.maxLength(1000)]);
      } else {
        notesControl?.setValidators([Validators.maxLength(1000)]);
      }
      notesControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.loadMyDeliveries();
  }

  loadMyDeliveries(): void {
    this.loading.set(true);
    this.error.set(null);

    this.deliveryService.getMyDeliveries().subscribe({
      next: (deliveries) => {
        this.deliveries.set(deliveries);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  openUpdateModal(delivery: Delivery): void {
    this.selectedDelivery.set(delivery);
    this.updateForm.patchValue({
      newStatus: delivery.status,
      deliveryNotes: delivery.deliveryNotes || ''
    });
    this.updateSuccess.set(false);
  }

  closeUpdateModal(): void {
    this.selectedDelivery.set(null);
    this.updateForm.reset();
    this.updating.set(false);
    this.updateSuccess.set(false);
  }

  submitUpdate(): void {
    if (this.updateForm.invalid || !this.selectedDelivery()) {
      return;
    }

    this.updating.set(true);

    this.deliveryService.updateStatus(
      this.selectedDelivery()!.id,
      this.updateForm.value
    ).subscribe({
      next: () => {
        this.updateSuccess.set(true);
        setTimeout(() => {
          this.closeUpdateModal();
          this.loadMyDeliveries();
        }, 1500);
      },
      error: (err) => {
        this.error.set(err.message);
        this.updating.set(false);
      }
    });
  }

  canTransitionTo(currentStatus: DeliveryStatus, newStatus: DeliveryStatus): boolean {
    const validTransitions: { [key: string]: DeliveryStatus[] } = {
      [DeliveryStatus.ASSIGNED]: [DeliveryStatus.IN_TRANSIT],
      [DeliveryStatus.IN_TRANSIT]: [DeliveryStatus.DELIVERED, DeliveryStatus.FAILED],
      [DeliveryStatus.DELIVERED]: [],
      [DeliveryStatus.FAILED]: []
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  getAvailableStatuses(currentStatus: DeliveryStatus): DeliveryStatus[] {
    const transitions: { [key: string]: DeliveryStatus[] } = {
      [DeliveryStatus.ASSIGNED]: [DeliveryStatus.ASSIGNED, DeliveryStatus.IN_TRANSIT],
      [DeliveryStatus.IN_TRANSIT]: [DeliveryStatus.IN_TRANSIT, DeliveryStatus.DELIVERED, DeliveryStatus.FAILED],
      [DeliveryStatus.DELIVERED]: [DeliveryStatus.DELIVERED],
      [DeliveryStatus.FAILED]: [DeliveryStatus.FAILED]
    };

    return transitions[currentStatus] || [currentStatus];
  }
}
