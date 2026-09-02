import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

// Phase 2, feature 6: "customers who viewed this also liked" via embedding
// cosine similarity against every other product's stored embedding.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const current = await queryOne<{ embedding: string | null }>(`SELECT embedding FROM products WHERE id = $1`, [params.id]);
  if (!current) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  if (!current.embedding) {
    // Fallback: same-category products if this product has no embedding yet.
    const fallback = await query(
      `SELECT id, name, slug, price, category, image_url FROM products
       WHERE id != $1 AND category = (SELECT category FROM products WHERE id = $1)
       LIMIT 6`,
      [params.id]
    );
    return NextResponse.json({ products: fallback });
  }

  const similar = await query(
    `SELECT id, name, slug, price, category, image_url
     FROM products
     WHERE id != $1 AND embedding IS NOT NULL
     ORDER BY embedding <=> (SELECT embedding FROM products WHERE id = $1)
     LIMIT 6`,
    [params.id]
  );
  return NextResponse.json({ products: similar });
}
