/* eslint-disable no-console */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { embedText } from "../lib/embeddings";
import { PRODUCTS } from "./seed-data";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");
}

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

let warnedNoOllama = false;

// Generates an embedding via the local Ollama model (see lib/embeddings.ts).
// Returns null (and warns once) if Ollama isn't reachable, so seeding can
// still complete — re-run "npm run seed" once Ollama is up to backfill.
async function embed(text: string): Promise<number[] | null> {
  try {
    return await embedText(text);
  } catch (err) {
    if (!warnedNoOllama) {
      console.warn(`  ! ${(err as Error).message}`);
      warnedNoOllama = true;
    } else {
      console.warn(`  ! embedding failed (Ollama unreachable)`);
    }
    return null;
  }
}

async function fetchUnsplashImage(query: string, slug: string): Promise<string> {
  const destPath = path.join(PRODUCTS_DIR, `${slug}.jpg`);
  const publicPath = `/products/${slug}.jpg`;

  if (fs.existsSync(destPath)) {
    return publicPath;
  }

  if (!UNSPLASH_KEY) {
    console.warn(`  ! UNSPLASH_ACCESS_KEY not set — skipping image download for "${query}". Get a free key at https://unsplash.com/developers`);
    return publicPath; // file won't exist; Next <Image> will 404 until the key is added and seed is re-run
  }

  const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=squarish`;
  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
  });
  if (!searchRes.ok) {
    console.warn(`  ! Unsplash search failed for "${query}" (${searchRes.status})`);
    return publicPath;
  }
  const searchData: any = await searchRes.json();
  const photo = searchData.results?.[0];
  if (!photo) {
    console.warn(`  ! No Unsplash results for "${query}"`);
    return publicPath;
  }

  const imgUrl = `${photo.urls.raw}&w=1200&h=1200&fit=crop&q=80`;
  const imgRes = await fetch(imgUrl);
  if (!imgRes.ok) {
    console.warn(`  ! Failed to download image for "${query}"`);
    return publicPath;
  }
  const buffer = Buffer.from(await imgRes.arrayBuffer());
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  fs.writeFileSync(destPath, buffer);
  return publicPath;
}

async function main() {
  console.log("Seeding Nudge...\n");
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

  console.log("Applying schema...");
  const schemaSql = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf-8");
  await pool.query(schemaSql);

  console.log("Clearing existing demo data...");
  await pool.query(
    `TRUNCATE TABLE reviews, order_items, orders, cart_items, wishlists, products, discount_codes, users RESTART IDENTITY CASCADE`
  );

  console.log("\nCreating accounts...");
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = (
    await pool.query(
      `INSERT INTO users (email, name, password_hash, role) VALUES ('admin@nudge.shop', 'Nudge Admin', $1, 'admin') RETURNING id`,
      [passwordHash]
    )
  ).rows[0];

  const customerSeeds = [
    { email: "amelia@example.com", name: "Amelia Novak" },
    { email: "bennett@example.com", name: "Bennett Cole" },
    { email: "clara@example.com", name: "Clara Whitfield" },
  ];
  const customers: { id: string; email: string; name: string }[] = [];
  for (const c of customerSeeds) {
    const row = (
      await pool.query(
        `INSERT INTO users (email, name, password_hash, role) VALUES ($1, $2, $3, 'customer') RETURNING id, email, name`,
        [c.email, c.name, passwordHash]
      )
    ).rows[0];
    customers.push(row);
  }
  console.log(`  Created 1 admin + ${customers.length} demo customers (all passwords: password123)`);

  console.log(`\nSeeding ${PRODUCTS.length} products (images + embeddings)...`);
  const productIds: Record<string, string> = {};
  let i = 0;
  for (const p of PRODUCTS) {
    i++;
    const slug = slugify(p.name);
    process.stdout.write(`  [${i}/${PRODUCTS.length}] ${p.name}... `);

    const imageUrl = await fetchUnsplashImage(p.unsplashQuery, slug);
    const vec = await embed(`${p.name}. Category: ${p.category}. ${p.description}`);
    const embeddingLiteral = vec ? toVectorLiteral(vec) : null;

    const row = (
      await pool.query(
        `INSERT INTO products (name, slug, description, price, category, stock_qty, image_url, embedding)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::vector) RETURNING id`,
        [p.name, slug, p.description, p.price, p.category, p.stock_qty, imageUrl, embeddingLiteral]
      )
    ).rows[0];
    productIds[p.name] = row.id;
    console.log(vec ? "done" : "done (no embedding)");
  }

  console.log("\nSeeding reviews...");
  const reviewSeeds: { product: string; customer: string; rating: number; comment: string }[] = [
    { product: "Chunky Knit Throw Blanket", customer: "amelia@example.com", rating: 5, comment: "Exactly the cozy warm blanket I wanted for my reading nook. Thicker and softer than I expected." },
    { product: "Chunky Knit Throw Blanket", customer: "bennett@example.com", rating: 4, comment: "Beautiful texture, sheds a little at first but settles down after a wash." },
    { product: "Terracotta Ribbed Planter — Small", customer: "clara@example.com", rating: 5, comment: "Perfect size for my pothos and the ribbing photographs so well." },
    { product: "Speckled Ceramic Mug — Set of 2", customer: "amelia@example.com", rating: 5, comment: "My new favorite morning mug. The speckled glaze is even nicer in person." },
    { product: "Speckled Ceramic Mug — Set of 2", customer: "clara@example.com", rating: 4, comment: "Lovely weight and finish, wish they came in a set of four." },
    { product: "Amber & Oakmoss Soy Candle", customer: "bennett@example.com", rating: 5, comment: "Fills the whole living room without being overpowering. Burns really evenly." },
    { product: "Woven Wall Hanging — Natural Fiber", customer: "clara@example.com", rating: 5, comment: "Gorgeous texture, immediately upgraded my bare living room wall." },
    { product: "Organic Edge Serving Bowl", customer: "amelia@example.com", rating: 4, comment: "Slightly smaller than I pictured but the glaze is stunning." },
    { product: "Seagrass Storage Basket — Large", customer: "bennett@example.com", rating: 5, comment: "Sturdy, well woven, and hides the kids' toys beautifully." },
    { product: "Waffle Weave Cotton Throw", customer: "clara@example.com", rating: 4, comment: "Lightweight and breathable, great for a warmer climate." },
    { product: "Handmade Stoneware Pitcher", customer: "amelia@example.com", rating: 5, comment: "Pours cleanly with no drips — form and function done right." },
    { product: "Fig Leaf & Cedar Candle", customer: "clara@example.com", rating: 4, comment: "Really sophisticated scent, not too sweet. Would buy again." },
    { product: "Rattan Mirror — Round", customer: "bennett@example.com", rating: 5, comment: "Statement piece in our entryway. Arrived carefully packaged too." },
    { product: "Reactive Glaze Pasta Bowls — Set of 4", customer: "amelia@example.com", rating: 5, comment: "Every bowl really is a little different — exactly what was promised." },
    { product: "Belly Basket Planter/Storage", customer: "clara@example.com", rating: 4, comment: "Using it for blankets in the nursery, holds shape well." },
    { product: "Alpaca Blend Fringe Throw", customer: "bennett@example.com", rating: 5, comment: "Unbelievably soft. Worth the splurge." },
    { product: "Matte Black Cylinder Planter", customer: "amelia@example.com", rating: 3, comment: "Nice pot but arrived with a small chip on the base." },
    { product: "Dried Botanical Wall Frame", customer: "clara@example.com", rating: 5, comment: "Delicate and beautiful, looks great in a hallway gallery wall." },
    { product: "Vintage Wash Linen Duvet Cover", customer: "bennett@example.com", rating: 5, comment: "Softened up after the first wash exactly like they said it would." },
    { product: "Woven Lidded Storage Basket", customer: "amelia@example.com", rating: 4, comment: "Great quality, lid fits snugly. Slightly smaller than expected." },
  ];
  for (const r of reviewSeeds) {
    const productId = productIds[r.product];
    const customer = customers.find((c) => c.email === r.customer);
    if (!productId || !customer) continue;
    await pool.query(`INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4)`, [
      productId,
      customer.id,
      r.rating,
      r.comment,
    ]);
  }
  console.log(`  Created ${reviewSeeds.length} reviews`);

  console.log("\nSeeding past orders...");
  const orderSeeds: { customer: string; daysAgo: number; items: { product: string; qty: number }[] }[] = [
    { customer: "amelia@example.com", daysAgo: 40, items: [{ product: "Chunky Knit Throw Blanket", qty: 1 }, { product: "Amber & Oakmoss Soy Candle", qty: 2 }] },
    { customer: "amelia@example.com", daysAgo: 12, items: [{ product: "Speckled Ceramic Mug — Set of 2", qty: 1 }] },
    { customer: "bennett@example.com", daysAgo: 55, items: [{ product: "Seagrass Storage Basket — Large", qty: 1 }, { product: "Woven Lidded Storage Basket", qty: 1 }] },
    { customer: "bennett@example.com", daysAgo: 8, items: [{ product: "Alpaca Blend Fringe Throw", qty: 1 }] },
    { customer: "clara@example.com", daysAgo: 30, items: [{ product: "Terracotta Ribbed Planter — Small", qty: 2 }, { product: "Organic Edge Serving Bowl", qty: 1 }] },
    { customer: "clara@example.com", daysAgo: 5, items: [{ product: "Woven Wall Hanging — Natural Fiber", qty: 1 }, { product: "Fig Leaf & Cedar Candle", qty: 1 }] },
  ];
  for (const o of orderSeeds) {
    const customer = customers.find((c) => c.email === o.customer)!;
    const itemsWithPrice = o.items
      .map((it) => {
        const seed = PRODUCTS.find((p) => p.name === it.product);
        return seed ? { ...it, price: seed.price, productId: productIds[it.product] } : null;
      })
      .filter(Boolean) as { product: string; qty: number; price: number; productId: string }[];
    const subtotal = itemsWithPrice.reduce((s, it) => s + it.price * it.qty, 0);
    const createdAt = new Date(Date.now() - o.daysAgo * 24 * 60 * 60 * 1000);

    const order = (
      await pool.query(
        `INSERT INTO orders (user_id, status, subtotal, discount_amount, total, shipping_name, shipping_address, shipping_city, shipping_zip, created_at)
         VALUES ($1, 'paid', $2, 0, $2, $3, '123 Maple Street', 'Portland', '97201', $4) RETURNING id`,
        [customer.id, subtotal, customer.name, createdAt]
      )
    ).rows[0];

    for (const it of itemsWithPrice) {
      await pool.query(`INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)`, [
        order.id,
        it.productId,
        it.qty,
        it.price,
      ]);
    }
  }
  console.log(`  Created ${orderSeeds.length} past orders`);

  console.log("\nSeeding wishlists...");
  const wishlistSeeds: { customer: string; products: string[] }[] = [
    { customer: "amelia@example.com", products: ["Rattan Mirror — Round", "Ribbed Ceramic Vase — Cream"] },
    { customer: "bennett@example.com", products: ["Concrete Hexagon Planter Trio", "Palo Santo & Clove Travel Candle"] },
    { customer: "clara@example.com", products: ["Nesting Rattan Baskets — Set of 3", "Handwoven Wool Lumbar Pillow Cover"] },
  ];
  for (const w of wishlistSeeds) {
    const customer = customers.find((c) => c.email === w.customer)!;
    for (const productName of w.products) {
      const productId = productIds[productName];
      if (!productId) continue;
      await pool.query(`INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [customer.id, productId]);
    }
  }
  console.log(`  Created wishlist items for ${wishlistSeeds.length} customers`);

  console.log("\nSeeding discount codes...");
  await pool.query(
    `INSERT INTO discount_codes (code, percent_off, active, expires_at) VALUES
       ('WELCOME10', 10, true, NULL),
       ('NUDGE20', 20, true, NULL),
       ('FLASH25', 25, true, $1)`,
    [new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
  );
  console.log("  Created 3 discount codes: WELCOME10, NUDGE20, FLASH25");

  console.log("\nDone! Seed summary:");
  console.log(`  - ${PRODUCTS.length} products across 6 categories`);
  console.log(`  - ${reviewSeeds.length} reviews`);
  console.log(`  - ${orderSeeds.length} past orders`);
  console.log(`  - 1 admin (admin@nudge.shop / password123)`);
  console.log(`  - ${customers.length} demo customers (password123): ${customers.map((c) => c.email).join(", ")}`);
  if (!UNSPLASH_KEY) console.log(`\n  NOTE: UNSPLASH_ACCESS_KEY was not set, so product images were not downloaded. Add it to .env and re-run "npm run seed" to fetch them.`);
  if (warnedNoOllama) console.log(`  NOTE: Ollama was unreachable, so some/all products have no embeddings yet — recommendations & semantic search won't work fully until Ollama is running (with the embedding model pulled) and you re-run "npm run seed".`);

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
