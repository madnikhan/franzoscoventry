import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { businessConfig, domainConfig } from "./data";
import type { CartLine, Order, OrderStatus, CreateOrderPayload } from "./types";

const DATA_FILE = path.join(process.cwd(), ".data/orders.json");

const STATUS_FLOW = domainConfig.statusFlow as Record<OrderStatus, OrderStatus[]>;

function lineTotal(line: CartLine): number {
  return line.unitPrice * line.quantity;
}

function computeTotals(
  type: CreateOrderPayload["type"],
  items: CartLine[]
): Pick<Order, "subtotal" | "deliveryFee" | "vat" | "total"> {
  const subtotal = items.reduce((sum, line) => sum + lineTotal(line), 0);
  const deliveryFee =
    type === "DELIVERY" && businessConfig.delivery.enabled
      ? businessConfig.delivery.fee
      : 0;
  const vatRate = businessConfig.vatRate ?? 0;
  const vat = (subtotal + deliveryFee) * vatRate;
  const total = subtotal + deliveryFee + vat;
  return { subtotal, deliveryFee, vat, total };
}

function seedDemoOrders(): Order[] {
  const now = new Date().toISOString();
  return [
    {
      id: randomUUID(),
      orderNumber: `${businessConfig.orderPrefix}1001`,
      type: "DELIVERY",
      status: "PREPARING",
      paymentStatus: "COMPLETED",
      paymentMethod: "card",
      customerName: "Demo Customer",
      customerPhone: "+447700900099",
      address: "1 Broadgate, Coventry CV1 1NH",
      subtotal: 18.4,
      deliveryFee: 2.5,
      vat: 4.18,
      total: 25.08,
      items: [
        {
          id: randomUUID(),
          name: "Half Grilled Chicken",
          quantity: 1,
          unitPrice: 8.95,
          customizations: { spice: "medium" },
        },
        {
          id: randomUUID(),
          name: "Garlic Bread (4 Slices)",
          quantity: 2,
          unitPrice: 4.95,
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      orderNumber: `${businessConfig.orderPrefix}1002`,
      type: "COLLECTION",
      status: "PENDING",
      paymentStatus: "COMPLETED",
      paymentMethod: "cash",
      customerName: "Walk-in Guest",
      customerPhone: "+447700900088",
      subtotal: 7.9,
      deliveryFee: 0,
      vat: 1.58,
      total: 9.48,
      items: [
        {
          id: randomUUID(),
          name: "Piri Piri Chicken Burger",
          quantity: 1,
          unitPrice: 7.9,
          customizations: { spice: "hot" },
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];
}

class OrderStore {
  private orders = new Map<string, Order>();
  private seq = 1003;

  constructor() {
    this.loadFromDisk();
    if (this.orders.size === 0) {
      for (const o of seedDemoOrders()) {
        this.orders.set(o.id, o);
      }
      this.persist();
    }
  }

  private loadFromDisk() {
    try {
      if (!fs.existsSync(DATA_FILE)) return;
      const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Order[];
      for (const o of raw) {
        this.orders.set(o.id, o);
        const num = parseInt(o.orderNumber.replace(/\D/g, ""), 10);
        if (!Number.isNaN(num) && num >= this.seq) this.seq = num + 1;
      }
    } catch {
      /* demo store — ignore corrupt file */
    }
  }

  persist() {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify([...this.orders.values()], null, 2));
  }

  list(): Order[] {
    return [...this.orders.values()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  getByOrderNumber(orderNumber: string): Order | undefined {
    return [...this.orders.values()].find(
      (o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase()
    );
  }

  create(payload: CreateOrderPayload, paymentStatus: Order["paymentStatus"]): Order {
    const totals = computeTotals(payload.type, payload.items);
    const now = new Date().toISOString();
    const orderNumber = `${businessConfig.orderPrefix}${this.seq++}`;
    const order: Order = {
      id: randomUUID(),
      orderNumber,
      type: payload.type,
      status: "PENDING",
      paymentStatus,
      paymentMethod: payload.paymentMethod,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail,
      address: payload.address,
      notes: payload.notes,
      items: payload.items.map((line) => ({
        id: randomUUID(),
        name: line.name,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        customizations: line.customizations,
      })),
      ...totals,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.set(order.id, order);
    this.persist();
    return order;
  }

  updateStatus(id: string, next: OrderStatus, driverId?: string): Order | null {
    const order = this.orders.get(id);
    if (!order) return null;
    const allowed = STATUS_FLOW[order.status] ?? [];
    if (!allowed.includes(next) && order.status !== next) {
      throw new Error(`Invalid status transition from ${order.status} to ${next}`);
    }
    order.status = next;
    order.updatedAt = new Date().toISOString();
    if (driverId) order.driverId = driverId;
    this.orders.set(id, order);
    this.persist();
    return order;
  }

  assignDriver(id: string, driverId: string): Order | null {
    const order = this.orders.get(id);
    if (!order || order.type !== "DELIVERY") return null;
    order.driverId = driverId;
    if (order.status === "READY_FOR_PICKUP") {
      order.status = "OUT_FOR_DELIVERY";
    }
    order.updatedAt = new Date().toISOString();
    this.persist();
    return order;
  }

  stats() {
    const orders = this.list();
    const today = new Date().toDateString();
    const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
    const revenue = orders
      .filter((o) => o.paymentStatus === "COMPLETED" && o.status !== "CANCELLED")
      .reduce((s, o) => s + o.total, 0);
    const active = orders.filter((o) =>
      ["PENDING", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY"].includes(
        o.status
      )
    ).length;
    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      revenue,
      active,
    };
  }
}

declare global {
  var __franzosOrderStore: OrderStore | undefined;
}

export function getOrderStore(): OrderStore {
  if (!global.__franzosOrderStore) {
    global.__franzosOrderStore = new OrderStore();
  }
  return global.__franzosOrderStore;
}
