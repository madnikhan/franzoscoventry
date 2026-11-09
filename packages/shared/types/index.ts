export type Role = "customer" | "driver" | "kitchen" | "till" | "admin";

export type OrderType = "DELIVERY" | "COLLECTION" | "TAKEAWAY";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface MenuChoice {
  id: string;
  name: string;
  priceDelta: number;
}

export interface MenuCustomization {
  id: string;
  name: string;
  required: boolean;
  maxChoices: number;
  choices: MenuChoice[];
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  spiceSelectable?: boolean;
  customizations?: MenuCustomization[];
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  items: MenuItem[];
}

export interface CartLine {
  itemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  customizations: Record<string, string>;
}
