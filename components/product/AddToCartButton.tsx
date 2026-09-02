"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product, quantity = 1 }: { product: Product; quantity?: number }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [justAdded, setJustAdded] = useState(false);

  async function handleClick() {
    await addItem(product, quantity);
    showToast(`Added ${product.name} to your bag`, "success");
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  const outOfStock = product.stock_qty <= 0;

  return (
    <Button size="lg" className="w-full" onClick={handleClick} disabled={outOfStock}>
      <motion.span
        animate={justAdded ? { y: [0, -6, 0], rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {justAdded ? (
            <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Check className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span key="bag" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <ShoppingBag className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
      {outOfStock ? "Out of stock" : justAdded ? "Added to bag" : "Add to bag"}
    </Button>
  );
}
