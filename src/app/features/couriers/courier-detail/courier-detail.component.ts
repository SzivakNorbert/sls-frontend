import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourierService } from '../../../core/services/courier.service';
import { Courier } from '../../../core/models/courier.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-courier-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, SidebarComponent, LoadingSpinnerComponent],
  templateUrl: './courier-detail.component.html',
  styleUrl: './courier-detail.component.css'
})
export class CourierDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courierService = inject(CourierService);

  courier = signal<Courier | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCourier(+id);
    }
  }

  loadCourier(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.courierService.getById(id).subscribe({
      next: (courier) => {
        this.courier.set(courier);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/couriers']);
  }
}