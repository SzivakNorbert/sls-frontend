import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  userName = signal(this.authService.getCurrentUser()?.name || '');
  userEmail = signal(this.authService.getCurrentUser()?.email || '');
  userRole = signal(this.authService.getCurrentUser()?.role || '');


  logout(): void {
    if (confirm('Biztosan ki szeretnél jelentkezni?')) {
      this.authService.logout();
    }
  }
}