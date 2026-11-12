export type Role = "customer" | "driver" | "kitchen" | "till" | "admin";

export type OrderType = "DELIVERY" | "COLLECTION" | "TAKEAWAY" | "DINE_IN";

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

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  customizations?: Record<string, string>;
}

export interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address?: string;
  tableNumber?: string;
  subtotal: number;
  deliveryFee: number;
  vat: number;
  total: number;
  driverId?: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  type: OrderType;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address?: string;
  tableNumber?: string;
  notes?: string;
  items: CartLine[];
}

export interface DriverSession {
  id: string;
  name: string;
  phone: string;
}
