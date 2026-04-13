import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Delivery, UpdateStatusRequest } from '../models/delivery.model';

@Injectable({ providedIn: 'root' })
export class DeliveryService {
       private http = inject(HttpClient);
       private apiUrl = `${environment.apiUrl}/deliveries`;

       getAll(): Observable<Delivery[]> {
              return this.http.get<Delivery[]>(this.apiUrl);
       }

       getByCourierId(courierId: number): Observable<Delivery[]> {
              return this.http.get<Delivery[]>(`${this.apiUrl}/courier/${courierId}`);
       }

       updateStatus(deliveryId: number, request: UpdateStatusRequest): Observable<Delivery> {
              return this.http.patch<Delivery>(`${this.apiUrl}/${deliveryId}/status`, request);
       }
}