export interface StatusHistory {
       id: number;
       oldStatus?: string | null;
       newStatus: string;
       changedAt: string;
       changedByUserId?: number | null;
       changedByUserName?: string | null;
}
