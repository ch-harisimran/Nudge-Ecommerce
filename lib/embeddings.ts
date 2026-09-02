// Embeddings are generated locally via Ollama (no external API key needed).
// Default model: nomic-embed-text (768 dimensions) — must match the
// `vector(768)` column size in db/schema.sql. If you switch models to one
// with a different output size, update EMBEDDING_DIM below AND the column
// definition in db/schema.sql, then re-run `npm run seed`.
export const EMBEDDING_DIM = 768;

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";

export async function embedText(text: string): Promise<number[]> {
  let res: Response;
  try {
    res = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: OLLAMA_EMBED_MODEL, prompt: text.slice(0, 8000) }),
    });
  } catch (err) {
    throw new Error(
      `Could not reach Ollama at ${OLLAMA_BASE_URL}. Is Ollama running? Start it with "ollama serve" and make sure you've pulled the model: "ollama pull ${OLLAMA_EMBED_MODEL}". (${(err as Error).message})`
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ollama embeddings request failed (${res.status}): ${text || "unknown error"}`);
  }

  const data = await res.json();
  const embedding: number[] | undefined = data.embedding;
  if (!embedding || !Array.isArray(embedding)) {
    throw new Error("Ollama returned an unexpected response shape for /api/embeddings.");
  }
  if (embedding.length !== EMBEDDING_DIM) {
    throw new Error(
      `Embedding from Ollama model "${OLLAMA_EMBED_MODEL}" has ${embedding.length} dimensions, but the database expects ${EMBEDDING_DIM}. Update EMBEDDING_DIM in lib/embeddings.ts and the vector(${EMBEDDING_DIM}) column in db/schema.sql to match, then re-run "npm run seed".`
    );
  }
  return embedding;
}

export function productEmbeddingInput(p: { name: string; description: string; category: string }): string {
  return `${p.name}. Category: ${p.category}. ${p.description}`;
}
