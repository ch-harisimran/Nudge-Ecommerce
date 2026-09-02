"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-clay-500">New season edit</p>
          <h1 className="font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
            Quiet objects for a <em className="not-italic text-clay-500">considered</em> home.
          </h1>
          <p className="mt-6 max-w-md text-base text-charcoal/60 dark:text-cream/60">
            Nudge curates candles, ceramics, and textiles from small studios — chosen for texture, warmth, and things that last.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link href="/products">
              <Button size="lg">
                Shop the collection <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/search" className="text-sm font-medium text-charcoal/70 underline-offset-4 hover:underline dark:text-cream/70">
              Try semantic search
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative aspect-[4/5] overflow-hidden rounded-xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=1200&q=85"
            alt="Editorial still life of ceramics and a linen throw on a warm-toned shelf"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
