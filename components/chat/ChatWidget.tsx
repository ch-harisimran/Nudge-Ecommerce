"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: "Hi! I'm the Nudge shopping assistant. Tell me what you're looking for — a room, a mood, a budget — and I'll find something from the catalog.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply, products: data.products }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I ran into an issue reaching the assistant. Check that OPENROUTER_API_KEY is set." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-clay-500 text-white shadow-soft"
        aria-label="Open shopping assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={open ? "x" : "chat"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
            {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed bottom-24 left-5 z-40 flex h-[32rem] w-[22rem] max-w-[90vw] flex-col overflow-hidden rounded-xl border border-charcoal/10 bg-white shadow-2xl dark:border-cream/10 dark:bg-[#2A2724]"
          >
            <div className="flex items-center gap-2 border-b border-charcoal/10 bg-cream px-4 py-3 dark:border-cream/10 dark:bg-charcoal">
              <Sparkles className="h-4 w-4 text-clay-500" />
              <p className="font-display text-lg">Nudge Assistant</p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-lg bg-clay-500 px-3 py-2 text-sm text-white"
                        : "max-w-[90%] rounded-lg bg-charcoal/5 px-3 py-2 text-sm dark:bg-cream/10"
                    }
                  >
                    <p>{m.content}</p>
                    {m.products && m.products.length > 0 && (
                      <div className="mt-2 flex flex-col gap-2">
                        {m.products.map((p) => (
                          <Link
                            key={p.id}
                            href={`/products/${p.id}`}
                            className="flex items-center gap-2 rounded-md border border-charcoal/10 bg-white p-2 hover:border-clay-300 dark:border-cream/10 dark:bg-charcoal"
                          >
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                              <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="40px" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-medium text-charcoal dark:text-cream">{p.name}</p>
                              <p className="text-xs text-clay-600 dark:text-clay-300">{formatPrice(p.price)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-charcoal/5 px-3 py-2 text-sm dark:bg-cream/10">Thinking…</div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            <div className="flex items-center gap-2 border-t border-charcoal/10 p-3 dark:border-cream/10">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask for a recommendation…"
                className="h-10 flex-1 rounded-md border border-charcoal/15 bg-transparent px-3 text-sm focus:border-clay-400 focus:outline-none dark:border-cream/20"
              />
              <button onClick={send} disabled={loading} className="rounded-md bg-clay-500 p-2.5 text-white disabled:opacity-50">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
