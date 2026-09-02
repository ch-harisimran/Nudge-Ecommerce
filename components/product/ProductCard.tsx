"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { WishlistButton } from "./WishlistButton";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-charcoal/5">
          <motion.div layoutId={`product-image-${product.id}`} className="absolute inset-0">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </motion.div>
          {product.stock_qty <= 5 && product.stock_qty > 0 && (
            <span className="absolute left-3 top-3 rounded-md bg-cream/90 px-2 py-1 text-[11px] font-medium text-clay-700 dark:bg-charcoal/90 dark:text-clay-300">
              Only {product.stock_qty} left
            </span>
          )}
          {product.stock_qty <= 0 && (
            <span className="absolute left-3 top-3 rounded-md bg-charcoal/80 px-2 py-1 text-[11px] font-medium text-white">
              Sold out
            </span>
          )}
          <WishlistButton productId={product.id} className="absolute right-3 top-3" />
        </div>
        <div className="mt-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium leading-snug">{product.name}</p>
            <p className="mt-0.5 text-xs text-charcoal/50 dark:text-cream/50">{product.category}</p>
          </div>
          <p className="whitespace-nowrap text-sm font-medium text-clay-600 dark:text-clay-300">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
