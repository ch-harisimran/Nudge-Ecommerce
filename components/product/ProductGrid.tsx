"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./ProductGridSkeleton";
import { CATEGORIES } from "@/lib/types";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (sort) params.set("sort", sort);
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      });
  }, [activeCategory, sort]);

  const filtered = useMemo(
    () => (maxPrice ? products.filter((p) => parseFloat(p.price) <= maxPrice) : products),
    [products, maxPrice]
  );

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">{activeCategory || "All Products"}</h1>
          <p className="mt-1 text-sm text-charcoal/50 dark:text-cream/50">{filtered.length} pieces</p>
        </div>
        <button
          onClick={() => setFilterOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg border border-charcoal/15 px-4 py-2 text-sm dark:border-cream/20 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className={cn("lg:block", filterOpen ? "block" : "hidden")}>
          <div className="sticky top-24 flex flex-col gap-8">
            <div>
              <p className="mb-3 text-sm font-medium">Category</p>
              <div className="flex flex-col gap-2">
                <FilterCheckbox
                  label="All"
                  checked={!activeCategory}
                  onChange={() => setParam("category", null)}
                />
                {CATEGORIES.map((c) => (
                  <FilterCheckbox
                    key={c}
                    label={c}
                    checked={activeCategory === c}
                    onChange={() => setParam("category", activeCategory === c ? null : c)}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium">Max price</p>
              <div className="flex flex-col gap-2">
                {[50, 100, 200].map((p) => (
                  <FilterCheckbox key={p} label={`Under $${p}`} checked={maxPrice === p} onChange={() => setMaxPrice(maxPrice === p ? null : p)} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium">Sort by</p>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setParam("sort", e.target.value)}
                  className="w-full appearance-none rounded-lg border border-charcoal/15 bg-transparent px-3 py-2 text-sm dark:border-cream/20"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 opacity-50" />
              </div>
            </div>
          </div>
        </aside>

        <div>
          {loading ? (
            <ProductGridSkeleton />
          ) : filtered.length === 0 ? (
            <p className="py-20 text-center text-charcoal/50 dark:text-cream/50">No products match those filters.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence>
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex items-center gap-2.5 text-left text-sm">
      <span
        className={cn(
          "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
          checked ? "border-clay-500 bg-clay-500" : "border-charcoal/25 dark:border-cream/25"
        )}
      >
        <motion.span initial={false} animate={{ scale: checked ? 1 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
          <Check className="h-3 w-3 text-white" />
        </motion.span>
      </span>
      <span className={cn(checked ? "text-clay-600 dark:text-clay-300" : "text-charcoal/70 dark:text-cream/70")}>{label}</span>
    </button>
  );
}
