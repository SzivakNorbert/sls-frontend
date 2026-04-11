import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private authService = inject(AuthService);

  isAdmin = signal(this.authService.isAdmin());
  isCourier = signal(this.authService.isCourier());

  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊', roles: ['ADMIN', 'COURIER'] },
    { label: 'Csomagok', route: '/packages', icon: '📦', roles: ['ADMIN', 'COURIER'] },
    { label: 'Futárok', route: '/couriers', icon: '🚗', roles: ['ADMIN'] },
    { label: 'Kézbesítések', route: '/deliveries', icon: '📋', roles: ['ADMIN'] },
    { label: 'Saját Kézbesítések', route: '/deliveries/my-deliveries', icon: '✅', roles: ['COURIER'] },
    { label: 'Nyomkövetés', route: '/packages/tracking', icon: '🔍', roles: ['ADMIN', 'COURIER'] }
  ];

  get filteredMenuItems(): MenuItem[] {
    const userRole = this.authService.getCurrentUser()?.role;
    return this.menuItems.filter(item =>
      !item.roles || item.roles.includes(userRole || '')
    );
  }
}