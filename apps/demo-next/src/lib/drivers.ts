import type { DriverSession } from "./types";

/** Demo credentials — not for production */
const DEMO_DRIVERS: Array<DriverSession & { password: string }> = [
  { id: "drv-1", name: "Alex Driver", phone: "+447700900001", password: "driver123" },
  { id: "drv-2", name: "Sam Courier", phone: "+447700900002", password: "driver123" },
];

export function authenticateDriver(phone: string, password: string): DriverSession | null {
  const normalized = phone.replace(/\s/g, "");
  const match = DEMO_DRIVERS.find(
    (d) => d.phone.replace(/\s/g, "") === normalized && d.password === password
  );
  if (!match) return null;
  return { id: match.id, name: match.name, phone: match.phone };
}
