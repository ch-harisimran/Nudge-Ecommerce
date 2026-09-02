"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import type { Product } from "@/lib/types";

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  loading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  lastTouchedAt: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const LOCAL_KEY = "nudge_guest_cart";

function readLocalCart(): { productId: string; quantity: number }[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocalCart(items: { productId: string; quantity: number }[]) {
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastTouchedAt, setLastTouchedAt] = useState(Date.now());
  const mergedRef = useRef(false);

  const hydrateFromServer = useCallback(async () => {
    const res = await fetch("/api/cart");
    if (res.ok) {
      const data = await res.json();
      setLines(data.lines || []);
    }
  }, []);

  const hydrateFromLocal = useCallback(async () => {
    const local = readLocalCart();
    if (local.length === 0) {
      setLines([]);
      return;
    }
    const res = await fetch("/api/products");
    const data = await res.json();
    const products: Product[] = data.products || [];
    const built: CartLine[] = local
      .map((li) => {
        const product = products.find((p) => p.id === li.productId);
        return product ? { product, quantity: li.quantity } : null;
      })
      .filter(Boolean) as CartLine[];
    setLines(built);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    setLoading(true);
    (async () => {
      if (user) {
        if (!mergedRef.current) {
          const local = readLocalCart();
          for (const item of local) {
            await fetch("/api/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId: item.productId, quantity: item.quantity }),
            });
          }
          writeLocalCart([]);
          mergedRef.current = true;
        }
        await hydrateFromServer();
      } else {
        await hydrateFromLocal();
      }
      setLoading(false);
    })();
  }, [user, authLoading, hydrateFromServer, hydrateFromLocal]);

  const touch = () => setLastTouchedAt(Date.now());

  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      touch();
      if (user) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id, quantity }),
        });
        await hydrateFromServer();
      } else {
        const local = readLocalCart();
        const existing = local.find((l) => l.productId === product.id);
        if (existing) existing.quantity += quantity;
        else local.push({ productId: product.id, quantity });
        writeLocalCart(local);
        setLines((prev) => {
          const existingLine = prev.find((l) => l.product.id === product.id);
          if (existingLine) {
            return prev.map((l) =>
              l.product.id === product.id ? { ...l, quantity: l.quantity + quantity } : l
            );
          }
          return [...prev, { product, quantity }];
        });
      }
      setIsOpen(true);
    },
    [user, hydrateFromServer]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      touch();
      if (user) {
        await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });
        await hydrateFromServer();
      } else {
        const local = readLocalCart();
        const updated = local
          .map((l) => (l.productId === productId ? { ...l, quantity } : l))
          .filter((l) => l.quantity > 0);
        writeLocalCart(updated);
        setLines((prev) =>
          prev
            .map((l) => (l.product.id === productId ? { ...l, quantity } : l))
            .filter((l) => l.quantity > 0)
        );
      }
    },
    [user, hydrateFromServer]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      touch();
      if (user) {
        await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
        await hydrateFromServer();
      } else {
        const local = readLocalCart().filter((l) => l.productId !== productId);
        writeLocalCart(local);
        setLines((prev) => prev.filter((l) => l.product.id !== productId));
      }
    },
    [user, hydrateFromServer]
  );

  const clearCart = useCallback(async () => {
    if (user) {
      await fetch("/api/cart?all=true", { method: "DELETE" });
    } else {
      writeLocalCart([]);
    }
    setLines([]);
  }, [user]);

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + parseFloat(l.product.price) * l.quantity, 0),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{
        lines,
        count,
        subtotal,
        isOpen,
        loading,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        lastTouchedAt,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
