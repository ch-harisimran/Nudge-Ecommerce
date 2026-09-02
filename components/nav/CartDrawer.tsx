"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, closeCart, lines, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl dark:bg-charcoal"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5 dark:border-cream/10">
              <h2 className="font-display text-xl">Your Bag</h2>
              <button onClick={closeCart} className="rounded-full p-2 hover:bg-charcoal/5 dark:hover:bg-cream/10">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-charcoal/50 dark:text-cream/50">
                  <ShoppingBag className="h-10 w-10" />
                  <p>Your bag is empty.</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-5">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.product.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-4 overflow-hidden"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-charcoal/5">
                          <Image src={line.product.image_url} alt={line.product.name} fill className="object-cover" sizes="80px" />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex justify-between gap-2">
                            <p className="text-sm font-medium leading-snug">{line.product.name}</p>
                            <p className="whitespace-nowrap text-sm font-medium">{formatPrice(line.product.price)}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-md border border-charcoal/15 dark:border-cream/20">
                              <button
                                className="p-1.5 hover:text-clay-500"
                                onClick={() => updateQuantity(line.product.id, Math.max(0, line.quantity - 1))}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-4 text-center text-sm">{line.quantity}</span>
                              <button
                                className="p-1.5 hover:text-clay-500"
                                onClick={() => updateQuantity(line.product.id, line.quantity + 1)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              className="text-xs text-charcoal/40 underline-offset-2 hover:text-clay-500 hover:underline dark:text-cream/40"
                              onClick={() => removeItem(line.product.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-charcoal/10 px-6 py-5 dark:border-cream/10">
                <div className="mb-4 flex items-center justify-between text-base">
                  <span className="text-charcoal/60 dark:text-cream/60">Subtotal</span>
                  <motion.span key={subtotal} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="font-display text-lg">
                    {formatPrice(subtotal)}
                  </motion.span>
                </div>
                <Link href="/checkout" onClick={closeCart}>
                  <Button className="w-full" size="lg">
                    Checkout
                  </Button>
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
