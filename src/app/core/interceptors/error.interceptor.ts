import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
       const router = inject(Router);
       const authService = inject(AuthService);

       return next(req).pipe(
              catchError((error: HttpErrorResponse) => {
                     let errorMessage = 'Ismeretlen hiba történt';

                     if (error.error instanceof ErrorEvent) {
                            // Client-side error
                            errorMessage = `Hiba: ${error.error.message}`;
                     } else {
                            // Server-side error
                            switch (error.status) {
                                   case 401:
                                          errorMessage = 'Nem vagy bejelentkezve';
                                          authService.logout();
                                          break;
                                   case 403:
                                          errorMessage = 'Nincs jogosultságod ehhez a művelethez';
                                          break;
                                   case 404:
                                          errorMessage = error.error?.message || 'Az erőforrás nem található';
                                          break;
                                   case 400:
                                          errorMessage = error.error?.message || 'Hibás kérés';
                                          break;
                                   case 500:
                                          errorMessage = 'Szerver hiba történt';
                                          break;
                                   default:
                                          errorMessage = error.error?.message || `Hiba történt: ${error.status}`;
                            }
                     }

                     console.error('HTTP Error:', errorMessage, error);
                     return throwError(() => new Error(errorMessage));
              })
       );
};