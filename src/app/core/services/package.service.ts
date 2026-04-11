import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Package, CreatePackageRequest, AssignCourierRequest } from '../models/package.model';
import { Delivery } from '../models/delivery.model';

@Injectable({
       providedIn: 'root'
})
export class PackageService {
       private http = inject(HttpClient);
       private apiUrl = `${environment.apiUrl}/packages`;

       getAll(): Observable<ApiResponse<Package[]>> {
              return this.http.get<ApiResponse<Package[]>>(this.apiUrl);
       }

       getById(id: number): Observable<ApiResponse<Package>> {
              return this.http.get<ApiResponse<Package>>(`${this.apiUrl}/${id}`);
       }

       getByTrackingNumber(trackingNumber: string): Observable<ApiResponse<Package>> {
              return this.http.get<ApiResponse<Package>>(`${this.apiUrl}/tracking/${trackingNumber}`);
       }

       create(request: CreatePackageRequest): Observable<ApiResponse<Package>> {
              return this.http.post<ApiResponse<Package>>(this.apiUrl, request);
       }

       assignCourier(request: AssignCourierRequest): Observable<ApiResponse<Delivery>> {
              return this.http.post<ApiResponse<Delivery>>(`${this.apiUrl}/assign`, request);
       }
}