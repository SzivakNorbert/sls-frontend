import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Courier, CreateCourierRequest } from '../models/courier.model';

@Injectable({
       providedIn: 'root'
})
export class CourierService {
       private http = inject(HttpClient);
       private apiUrl = `${environment.apiUrl}/couriers`;

       getAll(): Observable<ApiResponse<Courier[]>> {
              return this.http.get<ApiResponse<Courier[]>>(this.apiUrl);
       }

       getById(id: number): Observable<ApiResponse<Courier>> {
              return this.http.get<ApiResponse<Courier>>(`${this.apiUrl}/${id}`);
       }

       create(request: CreateCourierRequest): Observable<ApiResponse<Courier>> {
              return this.http.post<ApiResponse<Courier>>(this.apiUrl, request);
       }
}