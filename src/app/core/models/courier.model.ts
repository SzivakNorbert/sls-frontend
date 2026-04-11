export enum VehicleType {
       CAR = 'CAR',
       BIKE = 'BIKE',
       TRUCK = 'TRUCK',
       VAN = 'VAN'
}

export interface Courier {
       id: number;
       userId: number;
       name: string;
       email: string;
       vehicleType: VehicleType;
       licensePlate?: string;
       phone?: string;
       maxWeightKg?: number;
       isActive: boolean;
       activeDeliveries: number;
       totalDelivered: number;
}

export interface CreateCourierRequest {
       userId: number;
       vehicleType: VehicleType;
       licensePlate?: string;
       phone?: string;
       maxWeightKg?: number;
}