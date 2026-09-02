"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import type { Product } from "@/lib/types";

function stockBadge(qty: number) {
  if (qty <= 3) return <Badge variant="danger"><AlertTriangle className="mr-1 h-3 w-3" />{qty} left</Badge>;
  if (qty <= 10) return <Badge variant="warning">{qty} left</Badge>;
  return <Badge variant="sage">{qty} in stock</Badge>;
}

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[] | null>(null);

  function load() {
    fetch("/api/products").then((r) => r.json()).then((data) => setProducts(data.products || []));
  }

  useEffect(load, []);

  async function remove(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    showToast("Product deleted", "success");
    load();
  }

  const lowStockCount = products?.filter((p) => p.stock_qty <= 10).length || 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="font-display text-3xl">Admin Dashboard</h1>
        <Link href="/admin/products/new"><Button><Plus className="h-4 w-4" /> New product</Button></Link>
      </div>
      {lowStockCount > 0 && (
        <p className="mb-6 flex items-center gap-1.5 text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4" /> {lowStockCount} product{lowStockCount === 1 ? "" : "s"} running low on stock
        </p>
      )}
      <AdminNav />

      <div className="overflow-x-auto rounded-lg border border-charcoal/10 dark:border-cream/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-charcoal/10 bg-charcoal/[0.02] text-charcoal/50 dark:border-cream/10 dark:bg-cream/[0.02] dark:text-cream/50">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {!products
              ? null
              : products.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className="border-b border-charcoal/5 last:border-0 dark:border-cream/5"
                  >
                    <td className="flex items-center gap-3 px-4 py-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md"><Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="40px" /></div>
                      <span className="font-medium">{p.name}</span>
                    </td>
                    <td className="px-4 py-3 text-charcoal/60 dark:text-cream/60">{p.category}</td>
                    <td className="px-4 py-3">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">{stockBadge(p.stock_qty)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/products/${p.id}/edit`} className="rounded-md px-2 py-1 text-xs text-clay-600 hover:bg-clay-50 dark:text-clay-300 dark:hover:bg-clay-900/30">Edit</Link>
                        <button onClick={() => remove(p.id)} className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
