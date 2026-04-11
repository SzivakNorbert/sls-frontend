export enum PackageStatus {
       CREATED = 'CREATED',
       ASSIGNED = 'ASSIGNED',
       IN_TRANSIT = 'IN_TRANSIT',
       DELIVERED = 'DELIVERED',
       FAILED = 'FAILED'
}

export enum PackagePriority {
       NORMAL = 'NORMAL',
       EXPRESS = 'EXPRESS'
}

export interface Package {
       id: number;
       trackingNumber: string;
       senderName: string;
       receiverName: string;
       address: string;
       city: string;
       postalCode: string;
       weightKg: number;
       dimensions?: string;
       priority: PackagePriority;
       status: PackageStatus;
       notes?: string;
       createdAt: string;
       updatedAt: string;
       courierId?: number;
       courierName?: string;
       courierPhone?: string;
}

export interface CreatePackageRequest {
       senderName: string;
       receiverName: string;
       address: string;
       city: string;
       postalCode: string;
       weightKg: number;
       dimensions?: string;
       priority: PackagePriority;
       notes?: string;
}

export interface AssignCourierRequest {
       packageId: number;
       courierId: number;
}