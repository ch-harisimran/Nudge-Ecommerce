"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { CATEGORIES } from "@/lib/types";
import type { Product } from "@/lib/types";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || CATEGORIES[0],
    stock_qty: product?.stock_qty?.toString() || "10",
    image_url: product?.image_url || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      stock_qty: parseInt(form.stock_qty, 10),
      image_url: form.image_url,
    };
    const res = await fetch(product ? `/api/admin/products/${product.id}` : "/api/admin/products", {
      method: product ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not save product.");
      return;
    }
    showToast(product ? "Product updated" : "Product created", "success");
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <Textarea placeholder="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      <div className="grid grid-cols-2 gap-4">
        <Input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <Input type="number" placeholder="Stock quantity" value={form.stock_qty} onChange={(e) => setForm({ ...form, stock_qty: e.target.value })} required />
      </div>
      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="h-11 rounded-lg border border-charcoal/15 bg-white px-4 text-sm dark:border-cream/20 dark:bg-[#2A2724]"
      >
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <Input placeholder="Image URL (e.g. https://images.unsplash.com/...)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} required />
      {form.image_url && (
        <img src={form.image_url} alt="Preview" className="h-40 w-40 rounded-lg object-cover" />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" size="lg" loading={loading} className="self-start">
        {product ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}
