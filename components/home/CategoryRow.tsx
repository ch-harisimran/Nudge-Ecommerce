"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { WishlistButton } from "@/components/product/WishlistButton";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Product } from "@/lib/types";

export function CategoryRow({ category, highlighted = false }: { category: string; highlighted?: boolean }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/products?category=${encodeURIComponent(category)}`)
      .then((r) => r.json())
      .then((data) => setProducts((data.products || []).slice(0, 8)));
  }, [category]);

  function scroll(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  }

  if (products && products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          {highlighted && <p className="mb-1 text-xs font-medium uppercase tracking-widest text-sage-600 dark:text-sage-400">Picked for you</p>}
          <h2 className="font-display text-2xl sm:text-3xl">{category}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/products?category=${encodeURIComponent(category)}`} className="hidden items-center gap-1 text-sm text-charcoal/60 hover:text-clay-500 sm:flex dark:text-cream/60">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button onClick={() => scroll(-1)} className="rounded-full border border-charcoal/15 p-1.5 hover:bg-charcoal/5 dark:border-cream/20 dark:hover:bg-cream/10">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll(1)} className="rounded-full border border-charcoal/15 p-1.5 hover:bg-charcoal/5 dark:border-cream/20 dark:hover:bg-cream/10">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2">
        {!products
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-56 shrink-0" />)
          : products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="w-48 shrink-0 sm:w-56"
              >
                <Link href={`/products/${p.id}`}>
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-charcoal/5">
                    <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="240px" />
                    <WishlistButton productId={p.id} className="absolute right-2 top-2 h-8 w-8" />
                  </div>
                  <p className="mt-2 truncate text-sm font-medium">{p.name}</p>
                  <p className="text-sm text-clay-600 dark:text-clay-300">{formatPrice(p.price)}</p>
                </Link>
              </motion.div>
            ))}
      </div>
    </section>
  );
}
