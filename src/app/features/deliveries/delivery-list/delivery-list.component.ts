import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DeliveryService } from '../../../core/services/delivery.service';
import { Delivery } from '../../../core/models/delivery.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-delivery-list',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, SidebarComponent, StatusBadgeComponent, LoadingSpinnerComponent],
  templateUrl: './delivery-list.component.html',
  styleUrl: './delivery-list.component.css'
})
export class DeliveryListComponent implements OnInit {
  private deliveryService = inject(DeliveryService);

  deliveries = signal<Delivery[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadDeliveries();
  }

  loadDeliveries(): void {
    this.loading.set(true);
    this.error.set(null);

    this.deliveryService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          this.deliveries.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}