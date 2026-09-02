import { NextRequest, NextResponse } from "next/server";
import { query, queryOne, toVectorLiteral } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { embedText, productEmbeddingInput } from "@/lib/embeddings";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const updates = await req.json();
  const allowed = ["name", "description", "price", "category", "stock_qty", "image_url"];
  const sets: string[] = [];
  const vals: any[] = [];
  for (const key of allowed) {
    if (key in updates) {
      vals.push(updates[key]);
      sets.push(`${key} = $${vals.length}`);
    }
  }
  if (sets.length === 0) return NextResponse.json({ error: "No fields to update." }, { status: 400 });

  if (updates.name || updates.description || updates.category) {
    const current = await queryOne<{ name: string; description: string; category: string }>(
      `SELECT name, description, category FROM products WHERE id = $1`,
      [params.id]
    );
    if (current) {
      const merged = { ...current, ...updates };
      try {
        const vec = await embedText(productEmbeddingInput(merged));
        vals.push(toVectorLiteral(vec));
        sets.push(`embedding = $${vals.length}::vector`);
      } catch (err) {
        console.error("Embedding regeneration failed:", (err as Error).message);
      }
    }
  }

  vals.push(params.id);
  const product = await queryOne(
    `UPDATE products SET ${sets.join(", ")} WHERE id = $${vals.length}
     RETURNING id, name, slug, description, price, category, stock_qty, image_url, created_at`,
    vals
  );
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ product });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  await query(`DELETE FROM products WHERE id = $1`, [params.id]);
  return NextResponse.json({ ok: true });
}
