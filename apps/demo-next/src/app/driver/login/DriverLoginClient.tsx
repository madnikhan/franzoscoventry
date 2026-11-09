"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { DriverSession } from "@/lib/types";

const STORAGE = "franzos-driver-session";

export function DriverLoginClient() {
  const router = useRouter();
  const [phone, setPhone] = useState("+447700900001");
  const [password, setPassword] = useState("driver123");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/drivers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      return;
    }
    localStorage.setItem(STORAGE, JSON.stringify(data.driver as DriverSession));
    router.push("/driver");
  }

  return (
    <form onSubmit={onSubmit} className="fz-card space-y-4 p-6">
      <label className="block text-sm font-medium">
        Phone
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="fz-btn fz-btn-primary w-full py-2.5">
        Sign in
      </button>
    </form>
  );
}
