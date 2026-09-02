"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Products" },
  { href: "/admin/discounts", label: "Discount Codes" },
  { href: "/admin/activity", label: "Activity Log" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="mb-8 flex gap-1 border-b border-charcoal/10 dark:border-cream/10">
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={cn(
            "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
            pathname === t.href ? "border-clay-500 text-clay-600 dark:text-clay-300" : "border-transparent text-charcoal/50 hover:text-charcoal dark:text-cream/50"
          )}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
