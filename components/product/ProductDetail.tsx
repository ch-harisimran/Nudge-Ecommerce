"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, Undo2 } from "lucide-react";
import { ProductGallery } from "./ProductGallery";
import { WishlistButton } from "./WishlistButton";
import { AddToCartButton } from "./AddToCartButton";
import { StarRatingDisplay } from "./StarRating";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { Recommendations } from "./Recommendations";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { Product, Review } from "@/lib/types";

export function ProductDetail({
  product,
  reviews: initialReviews,
  showRecommendations = true,
}: {
  product: Product;
  reviews: Review[];
  showRecommendations?: boolean;
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-14">
        <ProductGallery product={product} />

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Badge variant="clay">{product.category}</Badge>
          <div className="mt-3 flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl sm:text-4xl">{product.name}</h1>
            <WishlistButton productId={product.id} className="shrink-0 !bg-transparent shadow-none" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <StarRatingDisplay rating={avgRating} />
            <span className="text-sm text-charcoal/50 dark:text-cream/50">
              {reviews.length > 0 ? `${avgRating.toFixed(1)} (${reviews.length} review${reviews.length === 1 ? "" : "s"})` : "No reviews yet"}
            </span>
          </div>
          <p className="mt-5 font-display text-2xl text-clay-600 dark:text-clay-300">{formatPrice(product.price)}</p>
          <p className="mt-5 max-w-prose text-sm leading-relaxed text-charcoal/70 dark:text-cream/70">{product.description}</p>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-charcoal/10 pt-6 text-sm text-charcoal/60 dark:border-cream/10 dark:text-cream/60">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> Free local delivery simulation on all orders
            </div>
            <div className="flex items-center gap-2">
              <Undo2 className="h-4 w-4" /> 30-day returns, no questions asked
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto max-w-3xl border-t border-charcoal/10 px-4 py-14 sm:px-6 dark:border-cream/10">
        <h2 className="mb-6 font-display text-2xl">Reviews</h2>
        <div className="mb-8">
          <ReviewForm productId={product.id} onSubmitted={(r) => setReviews((prev) => [r, ...prev])} />
        </div>
        <ReviewList reviews={reviews} />
      </div>

      {showRecommendations && <Recommendations productId={product.id} />}
    </div>
  );
}
