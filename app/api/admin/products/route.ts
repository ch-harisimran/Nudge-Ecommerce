import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query, queryOne, toVectorLiteral } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { embedText, productEmbeddingInput } from "@/lib/embeddings";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.string().min(1),
  stock_qty: z.number().int().min(0),
  image_url: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please fill in every field correctly." }, { status: 400 });
  const p = parsed.data;

  let embeddingLiteral: string | null = null;
  try {
    const vec = await embedText(productEmbeddingInput(p));
    embeddingLiteral = toVectorLiteral(vec);
  } catch (err) {
    console.error("Embedding generation failed (product saved without it):", (err as Error).message);
  }

  const baseSlug = slugify(p.name);
  let slug = baseSlug;
  let n = 1;
  while (await queryOne(`SELECT id FROM products WHERE slug = $1`, [slug])) {
    slug = `${baseSlug}-${++n}`;
  }

  const product = await queryOne(
    `INSERT INTO products (name, slug, description, price, category, stock_qty, image_url, embedding)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::vector)
     RETURNING id, name, slug, description, price, category, stock_qty, image_url, created_at`,
    [p.name, slug, p.description, p.price, p.category, p.stock_qty, p.image_url, embeddingLiteral]
  );
  return NextResponse.json({ product });
}
