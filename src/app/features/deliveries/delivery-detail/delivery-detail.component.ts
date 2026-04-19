import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeliveryService } from '../../../core/services/delivery.service';
import { Delivery } from '../../../core/models/delivery.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-delivery-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, SidebarComponent, StatusBadgeComponent, LoadingSpinnerComponent],
  templateUrl: './delivery-detail.component.html',
  styleUrl: './delivery-detail.component.css'
})
export class DeliveryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private deliveryService = inject(DeliveryService);

  delivery = signal<Delivery | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDelivery(+id);
    }
  }

  loadDelivery(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.deliveryService.getById(id).subscribe({
      next: (delivery) => {
        this.delivery.set(delivery);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/deliveries']);
  }
}