import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const orders = await query(
    `SELECT id, status, subtotal, discount_code, discount_amount, total, created_at
     FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [user.sub]
  );

  for (const order of orders as any[]) {
    order.items = await query(
      `SELECT oi.id, oi.quantity, oi.price_at_purchase, p.id as product_id, p.name, p.slug, p.image_url
       FROM order_items oi JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [order.id]
    );
  }

  return NextResponse.json({ orders });
}
