"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MailWarning } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { formatPrice } from "@/lib/utils";

export default function AdminActivityPage() {
  const [events, setEvents] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/abandoned-cart").then((r) => r.json()).then((data) => setEvents(data.events || []));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 font-display text-3xl">Activity Log</h1>
      <p className="mb-8 text-sm text-charcoal/60 dark:text-cream/60">
        Mock "abandoned cart" reminder emails — logged here (and to the server console) instead of actually sending mail, since this app runs locally only.
      </p>
      <AdminNav />

      {events && events.length === 0 && (
        <p className="text-charcoal/50 dark:text-cream/50">No abandoned carts logged yet. Add something to a cart and leave it idle for a minute.</p>
      )}

      <div className="flex flex-col gap-3">
        {events?.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-start gap-3 rounded-lg border border-charcoal/10 px-4 py-3 dark:border-cream/10"
          >
            <MailWarning className="mt-0.5 h-4 w-4 shrink-0 text-clay-500" />
            <div>
              <p className="text-sm">
                Reminder email to <span className="font-medium">{e.userEmail}</span> — {e.itemCount} item(s), {formatPrice(e.subtotal)}
              </p>
              <p className="text-xs text-charcoal/40 dark:text-cream/40">{new Date(e.loggedAt).toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
