import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Courier, CreateCourierRequest } from '../models/courier.model';

@Injectable({ providedIn: 'root' })
export class CourierService {
       private http = inject(HttpClient);
       private apiUrl = `${environment.apiUrl}/couriers`;

       getAll(): Observable<Courier[]> {
              return this.http.get<Courier[]>(this.apiUrl);
       }

       getById(id: number): Observable<Courier> {
              return this.http.get<Courier>(`${this.apiUrl}/${id}`);
       }

       create(request: CreateCourierRequest): Observable<Courier> {
              return this.http.post<Courier>(this.apiUrl, request);
       }
}