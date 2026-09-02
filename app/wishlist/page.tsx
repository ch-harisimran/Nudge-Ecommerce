"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import { useAuth } from "@/context/AuthContext";

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<any[] | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setProducts([]);
      return;
    }
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []));
  }, [user, authLoading]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-3xl">Your Wishlist</h1>
      {!user && !authLoading ? (
        <p className="text-charcoal/50 dark:text-cream/50">
          <Link href="/login?next=/wishlist" className="text-clay-600 underline dark:text-clay-300">Log in</Link> to view your saved items.
        </p>
      ) : !products ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-charcoal/50 dark:text-cream/50">
          <Heart className="h-10 w-10" />
          <p>Nothing saved yet. Tap the heart on any product to add it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence>
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
