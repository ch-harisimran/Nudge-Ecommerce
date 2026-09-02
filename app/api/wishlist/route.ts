import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ products: [] });
  const products = await query(
    `SELECT p.id, p.name, p.slug, p.description, p.price, p.category, p.stock_qty, p.image_url, p.created_at
     FROM wishlists w JOIN products p ON p.id = w.product_id
     WHERE w.user_id = $1 ORDER BY w.created_at DESC`,
    [user.sub]
  );
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in to save items." }, { status: 401 });
  const { productId } = await req.json();
  await query(
    `INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2) ON CONFLICT (user_id, product_id) DO NOTHING`,
    [user.sub, productId]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const productId = req.nextUrl.searchParams.get("productId");
  await query(`DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2`, [user.sub, productId]);
  return NextResponse.json({ ok: true });
}
