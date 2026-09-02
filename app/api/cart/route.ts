import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ lines: [] });
  const rows = await query(
    `SELECT c.quantity, p.id, p.name, p.slug, p.description, p.price, p.category, p.stock_qty, p.image_url, p.created_at
     FROM cart_items c JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1 ORDER BY c.updated_at DESC`,
    [user.sub]
  );
  const lines = rows.map((r: any) => ({
    quantity: r.quantity,
    product: {
      id: r.id, name: r.name, slug: r.slug, description: r.description, price: r.price,
      category: r.category, stock_qty: r.stock_qty, image_url: r.image_url, created_at: r.created_at,
    },
  }));
  return NextResponse.json({ lines });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in to save your cart." }, { status: 401 });
  const { productId, quantity = 1 } = await req.json();
  await queryOne(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart_items.quantity + $3, updated_at = now()`,
    [user.sub, productId, quantity]
  );
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const { productId, quantity } = await req.json();
  if (quantity <= 0) {
    await query(`DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`, [user.sub, productId]);
  } else {
    await query(
      `UPDATE cart_items SET quantity = $3, updated_at = now() WHERE user_id = $1 AND product_id = $2`,
      [user.sub, productId, quantity]
    );
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const all = req.nextUrl.searchParams.get("all");
  if (all) {
    await query(`DELETE FROM cart_items WHERE user_id = $1`, [user.sub]);
  } else {
    const productId = req.nextUrl.searchParams.get("productId");
    await query(`DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`, [user.sub, productId]);
  }
  return NextResponse.json({ ok: true });
}
