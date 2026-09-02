import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-charcoal/10 bg-cream dark:border-cream/10 dark:bg-charcoal">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl">Nudge</p>
            <p className="mt-3 max-w-xs text-sm text-charcoal/60 dark:text-cream/60">
              Considered home and lifestyle goods for slower, warmer living.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">Shop</p>
            <ul className="flex flex-col gap-2 text-sm text-charcoal/60 dark:text-cream/60">
              <li><Link href="/products?category=Candles">Candles</Link></li>
              <li><Link href="/products?category=Ceramics%20%26%20Tableware">Ceramics</Link></li>
              <li><Link href="/products?category=Textiles%20%26%20Throws">Textiles</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">Account</p>
            <ul className="flex flex-col gap-2 text-sm text-charcoal/60 dark:text-cream/60">
              <li><Link href="/account/orders">Order History</Link></li>
              <li><Link href="/wishlist">Wishlist</Link></li>
              <li><Link href="/login">Log in</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">Nudge</p>
            <p className="text-sm text-charcoal/60 dark:text-cream/60">
              A local demo store. Test-mode payments only — no real charges.
            </p>
          </div>
        </div>
        <p className="mt-12 text-xs text-charcoal/40 dark:text-cream/40">
          &copy; {new Date().getFullYear()} Nudge. Built for demonstration purposes.
        </p>
      </div>
    </footer>
  );
}
