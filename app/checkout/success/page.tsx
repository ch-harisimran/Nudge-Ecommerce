"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrder((data.orders || []).find((o: any) => o.id === orderId)));
  }, [orderId]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6">
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 14 }}>
        <PartyPopper className="h-14 w-14 text-clay-500" />
      </motion.div>
      <h1 className="mt-6 font-display text-3xl sm:text-4xl">Thank you for your order</h1>
      <p className="mt-3 text-charcoal/60 dark:text-cream/60">
        {order ? `Order #${order.id.slice(0, 8)} — ${formatPrice(order.total)}` : "Your order is confirmed."} A confirmation has been recorded to your account.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/account/orders"><Button>View order history</Button></Link>
        <Link href="/products"><Button variant="outline">Keep shopping</Button></Link>
      </div>
    </div>
  );
}
