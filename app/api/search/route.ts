import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { embedText } from "@/lib/embeddings";
import { toVectorLiteral } from "@/lib/db";

// Phase 2, feature 7: natural-language semantic search via embeddings,
// merged with a keyword fallback so exact-name searches remain reliable.
export async function POST(req: NextRequest) {
  const { query: q } = await req.json();
  if (!q || typeof q !== "string" || !q.trim()) {
    return NextResponse.json({ products: [] });
  }

  const keywordResults = await query(
    `SELECT id, name, slug, description, price, category, image_url
     FROM products
     WHERE name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1
     LIMIT 12`,
    [`%${q.trim()}%`]
  );

  let semanticResults: any[] = [];
  try {
    const embedding = await embedText(q);
    semanticResults = await query(
      `SELECT id, name, slug, description, price, category, image_url,
              1 - (embedding <=> $1::vector) as similarity
       FROM products
       WHERE embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector
       LIMIT 12`,
      [toVectorLiteral(embedding)]
    );
  } catch (err) {
    // If Ollama isn't reachable, gracefully degrade to keyword-only search.
    console.error("Semantic search unavailable:", (err as Error).message);
  }

  const byId = new Map<string, any>();
  for (const p of semanticResults) byId.set(p.id, { ...p, matchType: "semantic" });
  for (const p of keywordResults) if (!byId.has(p.id)) byId.set(p.id, { ...p, matchType: "keyword" });

  return NextResponse.json({ products: Array.from(byId.values()).slice(0, 16) });
}
