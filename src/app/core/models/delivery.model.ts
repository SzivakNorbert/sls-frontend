export enum DeliveryStatus {
       ASSIGNED = 'ASSIGNED',
       IN_TRANSIT = 'IN_TRANSIT',
       DELIVERED = 'DELIVERED',
       FAILED = 'FAILED'
}

export interface Delivery {
       id: number;
       packageId: number;
       trackingNumber: string;
       receiverName: string;
       address: string;
       city: string;
       courierId: number;
       courierName: string;
       status: DeliveryStatus;
       deliveryNotes?: string;
       assignedAt: string;
       deliveredAt?: string;
}

export interface UpdateStatusRequest {
       newStatus: DeliveryStatus;
       deliveryNotes?: string;
}