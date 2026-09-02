"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { ProgressSteps } from "@/components/checkout/ProgressSteps";
import { StripeCardForm } from "@/components/checkout/StripeCardForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { lines, subtotal, loading: cartLoading, clearCart } = useCart();

  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({ name: "", address: "", city: "", zip: "" });
  const [discountCode, setDiscountCode] = useState("");
  const [discountPreview, setDiscountPreview] = useState<{ code: string; percentOff: number } | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [totals, setTotals] = useState({ subtotal: 0, discountAmount: 0, total: 0 });
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/login?next=/checkout");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!cartLoading && lines.length === 0 && step === 0) router.replace("/products");
  }, [cartLoading, lines, step, router]);

  async function applyDiscount() {
    setDiscountError("");
    if (!discountCode.trim()) return;
    const res = await fetch("/api/discount/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: discountCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setDiscountError(data.error || "Invalid code.");
      setDiscountPreview(null);
      return;
    }
    setDiscountPreview(data);
  }

  async function startPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.zip) {
      setError("Please complete every shipping field.");
      return;
    }
    setError("");
    setStarting(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipping, discountCode: discountPreview?.code }),
    });
    const data = await res.json();
    setStarting(false);
    if (!res.ok) {
      setError(data.error || "Could not start checkout.");
      return;
    }
    setClientSecret(data.clientSecret);
    setOrderId(data.orderId);
    setTotals({ subtotal: data.subtotal, discountAmount: data.discountAmount, total: data.total });
    setStep(1);
  }

  async function handlePaymentSuccess() {
    await fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    setStep(2);
    await clearCart();
    setTimeout(() => router.push(`/checkout/success?orderId=${orderId}`), 1400);
  }

  if (authLoading || cartLoading || !user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-center font-display text-3xl">Checkout</h1>
      <ProgressSteps current={step} />

      {step === 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <form onSubmit={startPayment} className="flex flex-col gap-4">
            <h2 className="font-display text-xl">Shipping address</h2>
            <Input placeholder="Full name" value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} />
            <Input placeholder="Street address" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="City" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
              <Input placeholder="ZIP code" value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} />
            </div>

            <div className="mt-4">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-medium"><Tag className="h-4 w-4" /> Discount code</p>
              <div className="flex gap-2">
                <Input placeholder="e.g. WELCOME10" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} />
                <Button type="button" variant="outline" onClick={applyDiscount}>Apply</Button>
              </div>
              {discountPreview && <p className="mt-2 text-sm text-sage-600 dark:text-sage-400">{discountPreview.code} applied — {discountPreview.percentOff}% off</p>}
              {discountError && <p className="mt-2 text-sm text-red-500">{discountError}</p>}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" size="lg" loading={starting} className="mt-2">Continue to payment</Button>
          </form>

          <OrderSummary lines={lines} subtotal={subtotal} discountPercent={discountPreview?.percentOff} />
        </motion.div>
      )}

      {step === 1 && clientSecret && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-4 font-display text-xl">Payment</h2>
            <StripeCardForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
          </div>
          <OrderSummary lines={lines} subtotal={totals.subtotal} discountAmount={totals.discountAmount} total={totals.total} />
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-100 dark:bg-sage-900/40"
          >
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-sage-600 dark:text-sage-400">
              <motion.path
                d="M5 13l4 4L19 7"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </svg>
          </motion.div>
          <p className="font-display text-2xl">Payment confirmed</p>
          <p className="text-sm text-charcoal/60 dark:text-cream/60">Redirecting to your order…</p>
        </motion.div>
      )}
    </div>
  );
}

function OrderSummary({
  lines,
  subtotal,
  discountAmount = 0,
  discountPercent,
  total,
}: {
  lines: { product: { name: string; price: string; image_url: string }; quantity: number }[];
  subtotal: number;
  discountAmount?: number;
  discountPercent?: number;
  total?: number;
}) {
  const computedDiscount = discountPercent ? subtotal * (discountPercent / 100) : discountAmount;
  const computedTotal = total ?? subtotal - computedDiscount;
  return (
    <div className="h-fit rounded-lg border border-charcoal/10 p-5 dark:border-cream/10">
      <h3 className="mb-4 font-display text-lg">Order summary</h3>
      <ul className="mb-4 flex flex-col gap-3">
        {lines.map((l, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span className="text-charcoal/70 dark:text-cream/70">{l.product.name} × {l.quantity}</span>
            <span>{formatPrice(parseFloat(l.product.price) * l.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-1.5 border-t border-charcoal/10 pt-4 text-sm dark:border-cream/10">
        <div className="flex justify-between"><span className="text-charcoal/60 dark:text-cream/60">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        {computedDiscount > 0 && (
          <div className="flex justify-between text-sage-600 dark:text-sage-400"><span>Discount</span><span>-{formatPrice(computedDiscount)}</span></div>
        )}
        <div className="mt-1 flex justify-between font-display text-base"><span>Total</span><span>{formatPrice(computedTotal)}</span></div>
      </div>
    </div>
  );
}
