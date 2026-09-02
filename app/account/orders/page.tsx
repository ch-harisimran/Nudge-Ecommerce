"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const STATUS_VARIANT: Record<string, "clay" | "sage" | "neutral"> = {
  pending: "neutral",
  paid: "sage",
  fulfilled: "sage",
  cancelled: "neutral",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[] | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?next=/account/orders");
      return;
    }
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []));
  }, [user, authLoading, router]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-3xl">Order History</h1>
      {!orders ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-charcoal/50 dark:text-cream/50">No orders yet. <Link href="/products" className="text-clay-600 underline dark:text-clay-300">Start shopping</Link>.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-charcoal/10 p-5 dark:border-cream/10"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-charcoal/50 dark:text-cream/50">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_VARIANT[order.status] || "neutral"}>{order.status}</Badge>
                  <p className="font-display text-lg">{formatPrice(order.total)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {order.items?.map((item: any) => (
                  <Link key={item.id} href={`/products/${item.product_id}`} className="flex items-center gap-2 rounded-md border border-charcoal/10 p-2 text-xs dark:border-cream/10">
                    <div className="relative h-10 w-10 overflow-hidden rounded"><Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="40px" /></div>
                    <span>{item.name} × {item.quantity}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
