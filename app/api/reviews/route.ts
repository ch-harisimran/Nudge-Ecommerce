import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

// Phase 2, feature 9: customers may review a product after purchasing it.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in to leave a review." }, { status: 401 });

  const { productId, rating, comment } = await req.json();
  if (!productId || !rating || rating < 1 || rating > 5 || !comment?.trim()) {
    return NextResponse.json({ error: "Please provide a rating (1-5) and a comment." }, { status: 400 });
  }

  const purchased = await queryOne(
    `SELECT oi.id FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     WHERE o.user_id = $1 AND oi.product_id = $2 LIMIT 1`,
    [user.sub, productId]
  );
  if (!purchased) {
    return NextResponse.json({ error: "You can only review products you've purchased." }, { status: 403 });
  }

  const review = await queryOne(
    `INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4)
     RETURNING id, product_id, user_id, rating, comment, created_at`,
    [productId, user.sub, rating, comment.trim()]
  );
  return NextResponse.json({ review: { ...review, user_name: user.name } });
}
