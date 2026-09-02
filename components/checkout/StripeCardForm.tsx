"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function InnerForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    setLoading(false);
    if (confirmError) {
      setError(confirmError.message || "Payment failed. Try test card 4242 4242 4242 4242.");
      return;
    }
    onSuccess();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <PaymentElement />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <p className="text-xs text-charcoal/50 dark:text-cream/50">
        Test mode — use card number 4242 4242 4242 4242, any future expiry, any CVC and ZIP.
      </p>
      <Button type="submit" size="lg" loading={loading} disabled={!stripe}>
        Place order
      </Button>
    </form>
  );
}

export function StripeCardForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) {
  const { theme } = useTheme();

  if (!stripePromise) {
    return (
      <p className="rounded-lg border border-dashed border-charcoal/20 p-4 text-sm text-charcoal/60 dark:border-cream/20 dark:text-cream/60">
        Stripe isn't configured. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY to your .env file to enable checkout.
      </p>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: theme === "dark" ? "night" : "stripe",
          variables: {
            colorPrimary: "#C17A56",
            colorBackground: theme === "dark" ? "#2A2724" : "#FFFFFF",
            colorText: theme === "dark" ? "#FAF6F1" : "#211F1D",
            fontFamily: "Inter, sans-serif",
            borderRadius: "8px",
          },
        },
      }}
    >
      <InnerForm onSuccess={onSuccess} />
    </Elements>
  );
}
