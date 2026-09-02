"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

function galleryVariants(imageUrl: string) {
  const base = imageUrl.split("?")[0];
  return [
    { label: "Full view", url: `${base}?auto=format&fit=crop&w=1200&q=85` },
    { label: "Close up", url: `${base}?auto=format&fit=crop&w=1200&q=85&crop=entropy` },
    { label: "In context", url: `${base}?auto=format&fit=crop&w=1200&q=85&sat=-10` },
  ];
}

export function ProductGallery({ product, shared = true }: { product: Product; shared?: boolean }) {
  const variants = galleryVariants(product.image_url);
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-charcoal/5">
        {shared ? (
          <motion.div layoutId={`product-image-${product.id}`} className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <Image src={variants[active].url} alt={product.name} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="absolute inset-0">
              <Image src={variants[active].url} alt={product.name} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <div className="mt-4 flex gap-3">
        {variants.map((v, i) => (
          <button
            key={v.label}
            onClick={() => setActive(i)}
            className={cn(
              "relative h-16 w-16 overflow-hidden rounded-md border-2 transition-colors",
              active === i ? "border-clay-500" : "border-transparent"
            )}
          >
            <Image src={v.url} alt={v.label} fill className="object-cover" sizes="64px" />
          </button>
        ))}
      </div>
    </div>
  );
}
