"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

export function Recommendations({ productId }: { productId: string }) {
  const [products, setProducts] = useState<any[] | null>(null);

  useEffect(() => {
    setProducts(null);
    fetch(`/api/products/${productId}/recommendations`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []));
  }, [productId]);

  if (products && products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-clay-500" />
        <h2 className="font-display text-2xl">You might also like</h2>
      </div>
      <p className="-mt-4 mb-6 text-sm text-charcoal/50 dark:text-cream/50">Personalized by comparing this piece's style and description to the rest of the catalog.</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {!products
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)
          : products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Link href={`/products/${p.id}`}>
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-charcoal/5">
                    <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="200px" />
                  </div>
                  <p className="mt-2 truncate text-xs font-medium">{p.name}</p>
                  <p className="text-xs text-clay-600 dark:text-clay-300">{formatPrice(p.price)}</p>
                </Link>
              </motion.div>
            ))}
      </div>
    </section>
  );
}
