import { NextRequest, NextResponse } from "next/server";
import { query, toVectorLiteral } from "@/lib/db";
import { embedText } from "@/lib/embeddings";
import { callOpenRouter, type ChatMessage } from "@/lib/openrouter";

const SYSTEM_PROMPT = `You are the friendly, knowledgeable shopping assistant for Nudge, a minimalist home & lifestyle goods store selling candles, planters, ceramics, textiles, wall decor, and storage baskets.
Use the search_products tool whenever the customer describes a need, room, mood, or budget, so you can recommend real products from the catalog. Keep replies warm, concise (2-4 sentences), and specific to the products returned by the tool. Never invent products that weren't returned by the tool. If nothing relevant is found, say so honestly and suggest a broader search.`;

const tools = [
  {
    type: "function",
    function: {
      name: "search_products",
      description: "Search the Nudge product catalog by semantic meaning, optionally filtered by category or max price.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Natural language description of what the shopper wants." },
          category: {
            type: "string",
            description: "Optional category filter.",
            enum: ["Candles", "Planters & Pots", "Ceramics & Tableware", "Textiles & Throws", "Wall Decor", "Storage Baskets"],
          },
          max_price: { type: "number", description: "Optional maximum price in USD." },
        },
        required: ["query"],
      },
    },
  },
];

async function searchProducts(args: { query: string; category?: string; max_price?: number }) {
  const params: any[] = [];
  let sql = `SELECT id, name, slug, description, price, category, image_url FROM products WHERE embedding IS NOT NULL`;
  try {
    const embedding = await embedText(args.query);
    params.push(toVectorLiteral(embedding));
    sql = `SELECT id, name, slug, description, price, category, image_url FROM products WHERE embedding IS NOT NULL`;
    if (args.category) {
      params.push(args.category);
      sql += ` AND category = $${params.length}`;
    }
    if (args.max_price) {
      params.push(args.max_price);
      sql += ` AND price <= $${params.length}`;
    }
    sql += ` ORDER BY embedding <=> $1::vector LIMIT 5`;
    return await query(sql, params);
  } catch (err) {
    console.error("search_products embedding failed, falling back to keyword:", (err as Error).message);
    const kwParams: any[] = [`%${args.query}%`];
    let kwSql = `SELECT id, name, slug, description, price, category, image_url FROM products WHERE (name ILIKE $1 OR description ILIKE $1)`;
    if (args.category) {
      kwParams.push(args.category);
      kwSql += ` AND category = $${kwParams.length}`;
    }
    if (args.max_price) {
      kwParams.push(args.max_price);
      kwSql += ` AND price <= $${kwParams.length}`;
    }
    kwSql += ` LIMIT 5`;
    return await query(kwSql, kwParams);
  }
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const chatMessages: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];

  try {
    const first = await callOpenRouter(chatMessages, tools);
    const choice = first.choices?.[0];
    const toolCalls = choice?.message?.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      let allProducts: any[] = [];
      const toolMessages: ChatMessage[] = [];
      for (const call of toolCalls) {
        const args = JSON.parse(call.function.arguments || "{}");
        const products = await searchProducts(args);
        allProducts = allProducts.concat(products);
        toolMessages.push({
          role: "tool",
          tool_call_id: call.id,
          name: "search_products",
          content: JSON.stringify(products.map((p: any) => ({ id: p.id, name: p.name, price: p.price, category: p.category }))),
        });
      }

      const second = await callOpenRouter([
        ...chatMessages,
        { role: "assistant", content: choice.message.content, tool_calls: toolCalls },
        ...toolMessages,
      ]);
      const reply = second.choices?.[0]?.message?.content || "Here's what I found for you.";
      const uniqueProducts = Array.from(new Map(allProducts.map((p) => [p.id, p])).values()).slice(0, 5);
      return NextResponse.json({ reply, products: uniqueProducts });
    }

    return NextResponse.json({ reply: choice?.message?.content || "I'm not sure — could you tell me more?", products: [] });
  } catch (err) {
    console.error("AI chat error:", (err as Error).message);
    return NextResponse.json(
      { reply: "The shopping assistant is unavailable right now — make sure OPENROUTER_API_KEY is set in your .env file.", products: [] },
      { status: 200 }
    );
  }
}
