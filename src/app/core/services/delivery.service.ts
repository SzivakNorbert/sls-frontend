import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Delivery, UpdateStatusRequest } from '../models/delivery.model';

@Injectable({
       providedIn: 'root'
})
export class DeliveryService {
       private http = inject(HttpClient);
       private apiUrl = `${environment.apiUrl}/deliveries`;

       getAll(): Observable<ApiResponse<Delivery[]>> {
              return this.http.get<ApiResponse<Delivery[]>>(this.apiUrl);
       }

       getByCourierId(courierId: number): Observable<ApiResponse<Delivery[]>> {
              return this.http.get<ApiResponse<Delivery[]>>(`${this.apiUrl}/courier/${courierId}`);
       }

       updateStatus(deliveryId: number, request: UpdateStatusRequest): Observable<ApiResponse<Delivery>> {
              return this.http.patch<ApiResponse<Delivery>>(`${this.apiUrl}/${deliveryId}/status`, request);
       }
}