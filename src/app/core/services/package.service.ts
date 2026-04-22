import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Package, CreatePackageRequest, AssignCourierRequest } from '../models/package.model';
import { Delivery } from '../models/delivery.model';
import { StatusHistory } from '../models/status-history.model';

@Injectable({ providedIn: 'root' })
export class PackageService {
       private http = inject(HttpClient);
       private apiUrl = `${environment.apiUrl}/packages`;

       getAll(): Observable<Package[]> {
              return this.http.get<Package[]>(this.apiUrl);
       }

       getMyPackages(): Observable<Package[]> {
              return this.http.get<Package[]>(`${this.apiUrl}/my`);
       }

       getById(id: number): Observable<Package> {
              return this.http.get<Package>(`${this.apiUrl}/${id}`);
       }

       getByTrackingNumber(trackingNumber: string): Observable<Package> {
              return this.http.get<Package>(`${this.apiUrl}/tracking/${trackingNumber}`);
       }

       getTrackingHistory(trackingNumber: string): Observable<StatusHistory[]> {
              return this.http.get<StatusHistory[]>(`${this.apiUrl}/tracking/${trackingNumber}/history`);
       }

       create(request: CreatePackageRequest): Observable<Package> {
              return this.http.post<Package>(this.apiUrl, request);
       }

       assignCourier(request: AssignCourierRequest): Observable<Delivery> {
              return this.http.post<Delivery>(`${this.apiUrl}/assign`, request);
       }
}
