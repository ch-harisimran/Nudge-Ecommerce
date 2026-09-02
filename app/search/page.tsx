"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import type { Product } from "@/lib/types";

const EXAMPLES = [
  "cozy warm blanket for a reading nook",
  "something to make my apartment smell like a forest",
  "gift for someone who loves minimalist ceramics",
  "storage for a small entryway",
];

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  async function runSearch(query: string) {
    if (!query.trim()) return;
    setQ(query);
    setLoading(true);
    setLastQuery(query);
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResults(data.products || []);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl sm:text-4xl">Describe what you're looking for</h1>
        <p className="mt-3 text-sm text-charcoal/60 dark:text-cream/60">
          Semantic search understands meaning, not just keywords — try a full sentence.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(q);
        }}
        className="relative mx-auto max-w-2xl"
      >
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="cozy warm blanket for a reading nook..."
          className="h-14 w-full rounded-lg border border-charcoal/15 bg-white pl-12 pr-28 text-base focus:border-clay-400 focus:outline-none focus:ring-1 focus:ring-clay-400 dark:border-cream/20 dark:bg-[#2A2724]"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-clay-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-clay-600">
          Search
        </button>
      </form>

      <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => runSearch(ex)}
            className="rounded-full border border-charcoal/15 px-3 py-1.5 text-xs text-charcoal/60 hover:border-clay-400 hover:text-clay-600 dark:border-cream/20 dark:text-cream/60"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="mt-14">
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : results === null ? null : results.length === 0 ? (
          <p className="text-center text-charcoal/50 dark:text-cream/50">No products matched "{lastQuery}". Try a different phrase.</p>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-2 text-sm text-charcoal/50 dark:text-cream/50">
              <Sparkles className="h-4 w-4 text-clay-500" />
              {results.length} result{results.length === 1 ? "" : "s"} for "{lastQuery}"
            </div>
            <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence>
                {results.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
