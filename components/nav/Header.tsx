"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, Moon, ShoppingBag, Sun, User, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { CATEGORIES } from "@/lib/types";

export function Header() {
  const { count, openCart } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-charcoal/10 bg-cream/90 backdrop-blur dark:border-cream/10 dark:bg-charcoal/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/" className="font-display text-2xl tracking-tight">
            Nudge
          </Link>
        </div>

        <nav className="hidden items-center gap-7 lg:flex">
          {CATEGORIES.slice(0, 5).map((c) => (
            <Link
              key={c}
              href={`/products?category=${encodeURIComponent(c)}`}
              className="text-sm text-charcoal/70 transition-colors hover:text-clay-500 dark:text-cream/70"
            >
              {c}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link href="/search" className="rounded-full p-2 hover:bg-charcoal/5 dark:hover:bg-cream/10" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>
          <button onClick={toggle} className="rounded-full p-2 hover:bg-charcoal/5 dark:hover:bg-cream/10" aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          <Link href="/wishlist" className="rounded-full p-2 hover:bg-charcoal/5 dark:hover:bg-cream/10" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Link>
          <div className="group relative">
            <button className="rounded-full p-2 hover:bg-charcoal/5 dark:hover:bg-cream/10" aria-label="Account">
              <User className="h-5 w-5" />
            </button>
            <div className="invisible absolute right-0 top-full z-40 w-48 rounded-lg border border-charcoal/10 bg-white p-2 opacity-0 shadow-soft transition-all group-hover:visible group-hover:opacity-100 dark:border-cream/10 dark:bg-[#2A2724]">
              {user ? (
                <>
                  <p className="px-3 py-2 text-xs text-charcoal/50 dark:text-cream/50">Hi, {user.name.split(" ")[0]}</p>
                  <Link href="/account/orders" className="block rounded-md px-3 py-2 text-sm hover:bg-charcoal/5 dark:hover:bg-cream/10">
                    Order History
                  </Link>
                  <Link href="/wishlist" className="block rounded-md px-3 py-2 text-sm hover:bg-charcoal/5 dark:hover:bg-cream/10">
                    Wishlist
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin" className="block rounded-md px-3 py-2 text-sm hover:bg-charcoal/5 dark:hover:bg-cream/10">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => logout()}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-clay-600 hover:bg-charcoal/5 dark:hover:bg-cream/10"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block rounded-md px-3 py-2 text-sm hover:bg-charcoal/5 dark:hover:bg-cream/10">
                    Log in
                  </Link>
                  <Link href="/signup" className="block rounded-md px-3 py-2 text-sm hover:bg-charcoal/5 dark:hover:bg-cream/10">
                    Sign up
                  </Link>
                  <Link href="/admin/login" className="block rounded-md px-3 py-2 text-sm text-charcoal/50 hover:bg-charcoal/5 dark:text-cream/50 dark:hover:bg-cream/10">
                    Admin login
                  </Link>
                </>
              )}
            </div>
          </div>
          <button onClick={openCart} className="relative rounded-full p-2 hover:bg-charcoal/5 dark:hover:bg-cream/10" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-clay-500 px-1 text-[10px] font-semibold text-white"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-charcoal/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 z-50 h-full w-72 bg-cream p-6 dark:bg-charcoal lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <button onClick={() => setMobileOpen(false)} className="mb-6">
                <X className="h-6 w-6" />
              </button>
              <nav className="flex flex-col gap-4">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c}
                    href={`/products?category=${encodeURIComponent(c)}`}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-lg"
                  >
                    {c}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
