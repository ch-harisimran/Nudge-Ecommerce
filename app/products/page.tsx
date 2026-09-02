import { Suspense } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10"><ProductGridSkeleton /></div>}>
      <ProductGrid />
    </Suspense>
  );
}
