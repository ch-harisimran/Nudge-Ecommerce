"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ProductDetail } from "@/components/product/ProductDetail";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Product, Review } from "@/lib/types";

export default function ProductModal({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<{ product: Product; reviews: Review[] } | null>(null);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then(setData);
  }, [params.id]);

  function close() {
    router.back();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <motion.div
        className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      />
      <div className="relative mx-auto my-6 min-h-[calc(100vh-3rem)] w-full max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative rounded-xl bg-cream shadow-2xl dark:bg-charcoal"
        >
          <button
            onClick={close}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-hairline dark:bg-charcoal/90"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          {!data ? (
            <div className="grid grid-cols-1 gap-10 p-8 lg:grid-cols-2">
              <Skeleton className="aspect-square" />
              <div className="flex flex-col gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ) : (
            <ProductDetail product={data.product} reviews={data.reviews} showRecommendations={false} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
