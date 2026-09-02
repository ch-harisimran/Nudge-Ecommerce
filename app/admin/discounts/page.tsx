"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/context/ToastContext";

export default function AdminDiscountsPage() {
  const { showToast } = useToast();
  const [codes, setCodes] = useState<any[] | null>(null);
  const [code, setCode] = useState("");
  const [percentOff, setPercentOff] = useState("15");
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/discounts").then((r) => r.json()).then((data) => setCodes(data.codes || []));
  }
  useEffect(load, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, percent_off: parseInt(percentOff, 10) }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not create code.");
      return;
    }
    setCode("");
    showToast("Discount code created", "success");
    load();
  }

  async function toggle(id: string, active: boolean) {
    await fetch(`/api/admin/discounts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-3xl">Discount Codes</h1>
      <AdminNav />

      <form onSubmit={create} className="mb-8 flex items-end gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-charcoal/50 dark:text-cream/50">Code</label>
          <Input placeholder="WELCOME10" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required />
        </div>
        <div className="w-32">
          <label className="mb-1 block text-xs text-charcoal/50 dark:text-cream/50">% off</label>
          <Input type="number" min={1} max={100} value={percentOff} onChange={(e) => setPercentOff(e.target.value)} required />
        </div>
        <Button type="submit"><Plus className="h-4 w-4" /> Add</Button>
      </form>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      <div className="flex flex-col gap-3">
        {codes?.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between rounded-lg border border-charcoal/10 px-4 py-3 dark:border-cream/10"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-medium">{c.code}</span>
              <Badge variant="clay">{c.percent_off}% off</Badge>
              <Badge variant={c.active ? "sage" : "neutral"}>{c.active ? "Active" : "Inactive"}</Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toggle(c.id, c.active)}>{c.active ? "Deactivate" : "Activate"}</Button>
              <button onClick={() => remove(c.id)} className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="h-4 w-4" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
