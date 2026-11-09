/* Auto-generated from packages/shared/schema/domain.json — do not edit */
export const ROLES = [
  "customer",
  "driver",
  "kitchen",
  "till",
  "admin"
] as const;
export const ORDER_TYPES = [
  "DELIVERY",
  "COLLECTION",
  "TAKEAWAY"
] as const;
export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED"
] as const;
export const PAYMENT_STATUSES = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED"
] as const;
export const STATUS_FLOW = {
  "PENDING": [
    "CONFIRMED",
    "CANCELLED"
  ],
  "CONFIRMED": [
    "PREPARING",
    "CANCELLED"
  ],
  "PREPARING": [
    "READY_FOR_PICKUP",
    "CANCELLED"
  ],
  "READY_FOR_PICKUP": [
    "OUT_FOR_DELIVERY",
    "DELIVERED"
  ],
  "OUT_FOR_DELIVERY": [
    "DELIVERED",
    "CANCELLED"
  ],
  "DELIVERED": [],
  "CANCELLED": []
} as const;
