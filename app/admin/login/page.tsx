"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not log in.");
      return;
    }
    await refresh();
    router.push("/admin");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-4 flex items-center gap-2 text-charcoal/60 dark:text-cream/60">
          <ShieldCheck className="h-5 w-5" /> <span className="text-xs uppercase tracking-widest">Admin</span>
        </div>
        <h1 className="mb-2 font-display text-3xl">Admin sign in</h1>
        <p className="mb-8 text-sm text-charcoal/60 dark:text-cream/60">Manage the product catalog and discount codes.</p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" size="lg" loading={loading}>Log in</Button>
        </form>
        <p className="mt-6 text-xs text-charcoal/40 dark:text-cream/40">Demo admin: admin@nudge.shop / password123</p>
      </motion.div>
    </div>
  );
}
