"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/home/Hero";
import { CategoryRow } from "@/components/home/CategoryRow";
import { CATEGORIES } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([...CATEGORIES]);
  const [personalized, setPersonalized] = useState(false);

  useEffect(() => {
    if (!user) {
      setCategories([...CATEGORIES]);
      setPersonalized(false);
      return;
    }
    fetch("/api/personalize")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || [...CATEGORIES]);
        setPersonalized(!!data.personalized);
      });
  }, [user]);

  return (
    <div>
      <Hero />
      {categories.map((c, i) => (
        <CategoryRow key={c} category={c} highlighted={personalized && i === 0} />
      ))}
    </div>
  );
}
