"use client";

import { motion, AnimatePresence } from "framer-motion";
import { StarRatingDisplay } from "./StarRating";
import type { Review } from "@/lib/types";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-charcoal/50 dark:text-cream/50">No reviews yet — be the first to share your thoughts.</p>;
  }
  return (
    <ul className="flex flex-col gap-6">
      <AnimatePresence initial={false}>
        {reviews.map((r) => (
          <motion.li
            key={r.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-charcoal/10 pb-6 last:border-0 dark:border-cream/10"
          >
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-sm font-medium">{r.user_name || "Verified Customer"}</p>
              <p className="text-xs text-charcoal/40 dark:text-cream/40">{new Date(r.created_at).toLocaleDateString()}</p>
            </div>
            <StarRatingDisplay rating={r.rating} />
            <p className="mt-2 text-sm text-charcoal/70 dark:text-cream/70">{r.comment}</p>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
