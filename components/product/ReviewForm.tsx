"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StarRatingInput } from "./StarRating";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import type { Review } from "@/lib/types";

export function ReviewForm({ productId, onSubmitted }: { productId: string; onSubmitted: (review: Review) => void }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <p className="rounded-lg border border-dashed border-charcoal/20 p-4 text-sm text-charcoal/60 dark:border-cream/20 dark:text-cream/60">
        Log in and purchase this item to leave a review.
      </p>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      setError("Please choose a rating and write a short comment.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not submit your review.");
      return;
    }
    onSubmitted(data.review);
    setRating(0);
    setComment("");
    showToast("Thanks for your review!", "success");
  }

  return (
    <motion.form onSubmit={submit} className="flex flex-col gap-3 rounded-lg border border-charcoal/10 p-4 dark:border-cream/10">
      <p className="text-sm font-medium">Leave a review</p>
      <StarRatingInput value={rating} onChange={setRating} />
      <Textarea rows={3} placeholder="What did you think?" value={comment} onChange={(e) => setComment(e.target.value)} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" size="sm" className="self-start" loading={loading}>
        Submit review
      </Button>
    </motion.form>
  );
}
