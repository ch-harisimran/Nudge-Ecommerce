"use client";

import { useEffect, useState } from "react";
import { ProductDetail } from "@/components/product/ProductDetail";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Product, Review } from "@/lib/types";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<{ product: Product; reviews: Review[] } | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(async (r) => {
        if (!r.ok) {
          setNotFound(true);
          return;
        }
        setData(await r.json());
      });
  }, [params.id]);

  if (notFound) {
    return <p className="mx-auto max-w-7xl px-4 py-24 text-center text-charcoal/50">Product not found.</p>;
  }

  if (!data) {
    return (
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Skeleton className="aspect-square" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return <ProductDetail product={data.product} reviews={data.reviews} />;
}
