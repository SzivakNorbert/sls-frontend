import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { LoginRequest, AuthResponse, UserRole } from '../models/user.model';

@Injectable({
       providedIn: 'root'
})
export class AuthService {
       private http = inject(HttpClient);
       private router = inject(Router);

       private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getUserFromStorage());
       public currentUser$ = this.currentUserSubject.asObservable();

       public isLoggedIn = signal<boolean>(this.hasToken());

       private getUserFromStorage(): AuthResponse | null {
              const userJson = localStorage.getItem('currentUser');
              return userJson ? JSON.parse(userJson) : null;
       }

       private hasToken(): boolean {
              return !!localStorage.getItem('token');
       }

       login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
              return this.http.post<ApiResponse<AuthResponse>>(
                     `${environment.apiUrl}/auth/login`,
                     credentials
              ).pipe(
                     tap(response => {
                            if (response.success && response.data) {
                                   localStorage.setItem('token', response.data.token);
                                   localStorage.setItem('currentUser', JSON.stringify(response.data));
                                   this.currentUserSubject.next(response.data);
                                   this.isLoggedIn.set(true);
                            }
                     })
              );
       }

       logout(): void {
              localStorage.removeItem('token');
              localStorage.removeItem('currentUser');
              this.currentUserSubject.next(null);
              this.isLoggedIn.set(false);
              this.router.navigate(['/login']);
       }

       getToken(): string | null {
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