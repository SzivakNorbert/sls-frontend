import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, AuthResponse, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
       private http = inject(HttpClient);
       private router = inject(Router);
       private platformId = inject(PLATFORM_ID);

       private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getUserFromStorage());
       public currentUser$ = this.currentUserSubject.asObservable();

       public isLoggedIn = signal<boolean>(this.hasValidToken());

       private isBrowser(): boolean {
              return isPlatformBrowser(this.platformId);
       }

       private getUserFromStorage(): AuthResponse | null {
              if (!this.isBrowser()) return null;
              const userJson = localStorage.getItem('currentUser');
              return userJson ? JSON.parse(userJson) : null;
       }

       private hasValidToken(): boolean {
              if (!this.isBrowser()) return false;
              const token = localStorage.getItem('token');
              if (!token) return false;
              const expiry = localStorage.getItem('tokenExpiry');
              if (expiry && Date.now() > +expiry) {
                     this.clearStorage();
                     return false;
              }
              return true;
       }

       private clearStorage(): void {
              if (!this.isBrowser()) return;
              localStorage.removeItem('token');
              localStorage.removeItem('tokenExpiry');
              localStorage.removeItem('currentUser');
       }

       login(credentials: LoginRequest): Observable<AuthResponse> {
              return this.http
                     .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
                     .pipe(
                            tap((response) => {
                                   if (this.isBrowser()) {
                                          localStorage.setItem('token', response.token);
                                          if (response.expiresIn) {
                                                 localStorage.setItem('tokenExpiry', String(Date.now() + response.expiresIn * 1000));
                                          }
                                          localStorage.setItem('currentUser', JSON.stringify(response));
                                   }
                                   this.currentUserSubject.next(response);
                                   this.isLoggedIn.set(true);
                            })
                     );
       }

       logout(): void {
              this.clearStorage();
              this.currentUserSubject.next(null);
              this.isLoggedIn.set(false);
              this.router.navigate(['/login']);
       }

       getToken(): string | null {
              if (!this.isBrowser()) return null;
              return localStorage.getItem('token');
       }

       getCurrentUser(): AuthResponse | null {
              return this.currentUserSubject.value;
       }

       isAdmin(): boolean {
              const user = this.getCurrentUser();
              return user?.role === UserRole.ADMIN;
       }

       isCourier(): boolean {
              const user = this.getCurrentUser();
              return user?.role === UserRole.COURIER;
       }

       getUserId(): number | null {
              return this.getCurrentUser()?.userId || null;
       }
}