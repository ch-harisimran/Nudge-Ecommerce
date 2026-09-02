"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRatingDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          width={size}
          height={size}
          className={n <= Math.round(rating) ? "fill-clay-500 text-clay-500" : "text-charcoal/20 dark:text-cream/20"}
        />
      ))}
    </div>
  );
}

export function StarRatingInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            width={26}
            height={26}
            className={cn(
              "transition-colors",
              (hover || value) >= n ? "fill-clay-500 text-clay-500" : "text-charcoal/20 dark:text-cream/20"
            )}
          />
        </button>
      ))}
    </div>
  );
}
