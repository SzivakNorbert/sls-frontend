export enum UserRole {
       ADMIN = 'ADMIN',
       COURIER = 'COURIER'
}

export interface User {
       id: number;
       name: string;
       email: string;
       role: UserRole;
       createdAt: string;
}

export interface LoginRequest {
       email: string;
       password: string;
}

export interface AuthResponse {
       token: string;
       expiresIn: number;
       userId: number;
       name: string;
       email: string;
       role: UserRole;
}