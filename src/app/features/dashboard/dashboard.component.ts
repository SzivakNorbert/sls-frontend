import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PackageService } from '../../core/services/package.service';
import { CourierService } from '../../core/services/courier.service';
import { DeliveryService } from '../../core/services/delivery.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { Package, PackageStatus } from '../../core/models/package.model';
import { Courier } from '../../core/models/courier.model';
import { Delivery, DeliveryStatus } from '../../core/models/delivery.model';
import { forkJoin } from 'rxjs';

interface DashboardStats {
  totalPackages: number;
  createdPackages: number;
  inTransitPackages: number;
  deliveredPackages: number;
  failedPackages: number;
  totalCouriers: number;
  activeCouriers: number;
  totalDeliveries: number;
  myActiveDeliveries?: number;
  myTotalDelivered?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private packageService = inject(PackageService);
  private courierService = inject(CourierService);
  private deliveryService = inject(DeliveryService);
  private router = inject(Router);

  stats = signal<DashboardStats>({
    totalPackages: 0,
    createdPackages: 0,
    inTransitPackages: 0,
    deliveredPackages: 0,
    failedPackages: 0,
    totalCouriers: 0,
    activeCouriers: 0,
    totalDeliveries: 0
  });

  loading = signal(true);
  isAdmin = signal(false);
  isCourier = signal(false);
  userName = signal('');

  ngOnInit(): void {
    this.isAdmin.set(this.authService.isAdmin());
    this.isCourier.set(this.authService.isCourier());
    this.userName.set(this.authService.getCurrentUser()?.name || '');

    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);

    if (this.isAdmin()) {
      this.loadAdminDashboard();
    } else {
      this.loadCourierDashboard();
    }
  }

  private loadAdminDashboard(): void {
    forkJoin({
      packages: this.packageService.getAll(),
      couriers: this.courierService.getAll(),
      deliveries: this.deliveryService.getAll()
    }).subscribe({
      next: (result) => {
        const packages = result.packages;     // Package[]
        const couriers = result.couriers;     // Courier[]
        const deliveries = result.deliveries; // Delivery[]

        this.stats.set({
          totalPackages: packages.length,
          createdPackages: packages.filter((p) => p.status === PackageStatus.CREATED).length,
          inTransitPackages: packages.filter((p) => p.status === PackageStatus.IN_TRANSIT).length,
          deliveredPackages: packages.filter((p) => p.status === PackageStatus.DELIVERED).length,
          failedPackages: packages.filter((p) => p.status === PackageStatus.FAILED).length,
          totalCouriers: couriers.length,
          activeCouriers: couriers.filter((c) => c.isActive).length,
          totalDeliveries: deliveries.length
        });

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Dashboard adatok betöltése sikertelen:', err);
        this.loading.set(false);
      }
    });
  }

  private loadCourierDashboard(): void {
    const userId = this.authService.getUserId();

    forkJoin({
      packages: this.packageService.getAll(),
      couriers: this.courierService.getAll()
    }).subscribe({
      next: (result) => {
        const packages = result.packages;
        const couriers = result.couriers;
        const myCourier = couriers.find((c) => c.userId === userId);

        if (myCourier) {
          this.stats.set({
            totalPackages: packages.length,
            createdPackages: packages.filter((p) => p.status === PackageStatus.CREATED).length,
            inTransitPackages: packages.filter((p) => p.status === PackageStatus.IN_TRANSIT).length,
            deliveredPackages: packages.filter((p) => p.status === PackageStatus.DELIVERED).length,
            failedPackages: packages.filter((p) => p.status === PackageStatus.FAILED).length,
            totalCouriers: couriers.length,
            activeCouriers: couriers.filter((c) => c.isActive).length,
            totalDeliveries: 0,
            myActiveDeliveries: myCourier.activeDeliveries,
            myTotalDelivered: myCourier.totalDelivered
          });
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Dashboard adatok betöltése sikertelen:', err);
        this.loading.set(false);
      }
    });
  }
}