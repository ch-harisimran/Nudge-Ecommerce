"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

// Phase 3, feature 14: if a cart sits untouched for a while, log a mock
// "reminder email" event server-side (console + admin-visible log). No real
// email is sent since this app is local-only.
const IDLE_THRESHOLD_MS = 60_000; // 1 minute of inactivity for demo purposes

export function AbandonedCartWatcher() {
  const { lines, lastTouchedAt } = useCart();
  const { user } = useAuth();
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
  }, [lastTouchedAt]);

  useEffect(() => {
    if (lines.length === 0) return;
    const timer = setTimeout(() => {
      if (firedRef.current) return;
      firedRef.current = true;
      fetch("/api/admin/abandoned-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user?.email ?? "guest",
          itemCount: lines.reduce((s, l) => s + l.quantity, 0),
          subtotal: lines.reduce((s, l) => s + parseFloat(l.product.price) * l.quantity, 0),
        }),
      }).catch(() => {});
    }, IDLE_THRESHOLD_MS);
    return () => clearTimeout(timer);
  }, [lines, lastTouchedAt, user]);

  return null;
}
