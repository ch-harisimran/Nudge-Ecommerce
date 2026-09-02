import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { CATEGORIES } from "@/lib/types";

// Phase 3, feature 12: order category sections by the logged-in customer's
// own purchase + wishlist history, most-relevant first.
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ categories: CATEGORIES });

  const rows = await query<{ category: string; weight: number }>(
    `SELECT category, COUNT(*)::int as weight FROM (
       SELECT p.category FROM order_items oi
         JOIN orders o ON o.id = oi.order_id
         JOIN products p ON p.id = oi.product_id
        WHERE o.user_id = $1
       UNION ALL
       SELECT p.category FROM wishlists w
         JOIN products p ON p.id = w.product_id
        WHERE w.user_id = $1
     ) combined
     GROUP BY category
     ORDER BY weight DESC`,
    [user.sub]
  );

  const ranked = rows.map((r) => r.category);
  const rest = CATEGORIES.filter((c) => !ranked.includes(c));
  return NextResponse.json({ categories: [...ranked, ...rest], personalized: ranked.length > 0 });
}
