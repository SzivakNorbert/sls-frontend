import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface TestUserCredential {
  label: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  testUsers: TestUserCredential[] = [
    { label: 'Admin', email: 'admin@sls.com', password: 'admin123' },
    { label: 'Futár', email: 'anna@sls.com', password: 'anna123' },
    { label: 'Futár', email: 'john@sls.com', password: 'john123' }
  ];

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.login(this.loginForm.value);
  }

  loginAs(testUser: TestUserCredential): void {
    this.loginForm.patchValue({
      email: testUser.email,
      password: testUser.password
    });
    this.login({ email: testUser.email, password: testUser.password });
  }

  private login(credentials: { email: string; password: string }): void {
    this.loading.set(true);
    this.error.set(null);

    this.authService.login(credentials).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        this.error.set(err.message || 'Bejelentkezés sikertelen');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
