import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourierService } from '../../../core/services/courier.service';
import { Courier } from '../../../core/models/courier.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-courier-list',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, SidebarComponent, LoadingSpinnerComponent],
  templateUrl: './courier-list.component.html',
  styleUrl: './courier-list.component.css'
})
export class CourierListComponent implements OnInit {
  private courierService = inject(CourierService);

  couriers = signal<Courier[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCouriers();
  }

  loadCouriers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.courierService.getAll().subscribe({
      next: (couriers) => {
        this.couriers.set(couriers);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}