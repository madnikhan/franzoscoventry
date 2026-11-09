"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import type { DriverSession, Order } from "@/lib/types";

const STORAGE = "franzos-driver-session";

export function DriverClient() {
  const [driver, setDriver] = useState<DriverSession | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setDriver(JSON.parse(raw) as DriverSession);
    } catch {
      /* ignore */
    }
  }, []);

  const load = useCallback(async () => {
    const q = driver ? `?driverId=${encodeURIComponent(driver.id)}` : "";
    const res = await fetch(`/api/drivers/deliveries${q}`, { cache: "no-store" });
    const data = await res.json();
    setOrders(data.orders ?? []);
  }, [driver]);

  useEffect(() => {
    if (!driver) return;
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [driver, load]);

  async function accept(orderId: string) {
    if (!driver) return;
    await fetch("/api/drivers/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, action: "accept", driverId: driver.id }),
    });
    load();
  }

  async function delivered(orderId: string) {
    if (!driver) return;
    await fetch("/api/drivers/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, action: "delivered", driverId: driver.id }),
    });
    load();
  }

  function logout() {
    localStorage.removeItem(STORAGE);
    setDriver(null);
    setOrders([]);
  }

  if (!driver) {
    return (
      <div className="fz-card max-w-md p-6">
        <p className="text-[color:var(--fz-muted)]">Sign in to see assigned deliveries.</p>
        <Link href="/driver/login" className="fz-btn fz-btn-primary mt-4 inline-block">
          Driver login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm">
        Logged in as <strong>{driver.name}</strong> ({driver.phone})
        <button type="button" onClick={logout} className="ml-3 text-[color:var(--fz-flame)] underline">
          Sign out
        </button>
      </p>
      <ul className="grid gap-4">
        {orders.map((order) => (
          <li key={order.id} className="fz-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-2xl">{order.orderNumber}</p>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-1 text-sm">{order.address}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {order.status === "READY_FOR_PICKUP" && (
                <button
                  type="button"
                  onClick={() => accept(order.id)}
                  className="fz-btn fz-btn-primary"
                >
                  Accept delivery
                </button>
              )}
              {order.status === "OUT_FOR_DELIVERY" && order.driverId === driver.id && (
                <button
                  type="button"
                  onClick={() => delivered(order.id)}
                  className="fz-btn rounded-xl bg-[color:var(--fz-leaf)] px-4 py-2 font-semibold text-white"
                >
                  Mark delivered
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {!orders.length && (
        <p className="text-[color:var(--fz-muted)]">No deliveries right now.</p>
      )}
    </div>
  );
}
