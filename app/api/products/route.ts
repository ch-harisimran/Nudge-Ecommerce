import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const sort = req.nextUrl.searchParams.get("sort"); // price_asc | price_desc | newest
  const params: any[] = [];
  let sql = `SELECT id, name, slug, description, price, category, stock_qty, image_url, created_at FROM products`;
  if (category) {
    params.push(category);
    sql += ` WHERE category = $${params.length}`;
  }
  if (sort === "price_asc") sql += ` ORDER BY price ASC`;
  else if (sort === "price_desc") sql += ` ORDER BY price DESC`;
  else sql += ` ORDER BY created_at DESC`;

  const products = await query(sql, params);
  return NextResponse.json({ products });
}
