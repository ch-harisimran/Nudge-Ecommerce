"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Shipping", "Payment", "Confirm"];

export function ProgressSteps({ current }: { current: number }) {
  return (
    <div className="mx-auto mb-12 flex max-w-md items-center">
      {STEPS.map((label, i) => (
        <div key={label} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{
                backgroundColor: i < current ? "#C17A56" : i === current ? "#C17A56" : "transparent",
                borderColor: i <= current ? "#C17A56" : "rgba(33,31,29,0.2)",
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-medium"
            >
              {i < current ? <Check className="h-4 w-4 text-white" /> : <span className={i === current ? "text-white" : "text-charcoal/40 dark:text-cream/40"}>{i + 1}</span>}
            </motion.div>
            <span className={cn("text-xs", i <= current ? "text-clay-600 dark:text-clay-300" : "text-charcoal/40 dark:text-cream/40")}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="relative mx-2 h-0.5 flex-1 bg-charcoal/10 dark:bg-cream/10">
              <motion.div
                className="absolute inset-y-0 left-0 bg-clay-500"
                initial={{ width: 0 }}
                animate={{ width: i < current ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
