"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

export function WishlistButton({ productId, className }: { productId: string; className?: string }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [filled, setFilled] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user) {
      setChecked(true);
      return;
    }
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => {
        setFilled((data.products || []).some((p: any) => p.id === productId));
        setChecked(true);
      });
  }, [user, productId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast("Log in to save items to your wishlist.", "info");
      return;
    }
    const next = !filled;
    setFilled(next);
    if (next) {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      showToast("Added to wishlist", "success");
    } else {
      await fetch(`/api/wishlist?productId=${productId}`, { method: "DELETE" });
      showToast("Removed from wishlist", "info");
    }
  }

  if (!checked) return <div className={cn("h-9 w-9", className)} />;

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 1.35 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-hairline backdrop-blur dark:bg-charcoal/80",
        className
      )}
      aria-label="Toggle wishlist"
    >
      <Heart
        className={cn("h-4.5 w-4.5 transition-colors", filled ? "fill-sage-500 text-sage-500" : "text-charcoal/50 dark:text-cream/60")}
      />
    </motion.button>
  );
}
