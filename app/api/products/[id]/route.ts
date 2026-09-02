import { NextRequest, NextResponse } from "next/server";
import { queryOne, query } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = await queryOne(
    `SELECT id, name, slug, description, price, category, stock_qty, image_url, created_at FROM products WHERE id = $1`,
    [params.id]
  );
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const reviews = await query(
    `SELECT r.id, r.rating, r.comment, r.created_at, u.name as user_name
     FROM reviews r JOIN users u ON u.id = r.user_id
     WHERE r.product_id = $1 ORDER BY r.created_at DESC`,
    [params.id]
  );

  return NextResponse.json({ product, reviews });
}
