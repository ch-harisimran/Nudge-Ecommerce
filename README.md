# 🕯️ Nudge

**Home & lifestyle goods, sold the way a small studio would sell them.**

A minimalist, editorial e-commerce storefront with real AI behind it — semantic product search, embedding-based recommendations, and a conversational shopping assistant — built to run entirely on your own machine.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14.2-000000?logo=nextdotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?logo=postgresql&logoColor=white">
  <img alt="Stripe" src="https://img.shields.io/badge/Payments-Stripe%20test%20mode-635BFF?logo=stripe&logoColor=white">
  <img alt="Ollama" src="https://img.shields.io/badge/Embeddings-Ollama%20(local)-10B981">
  <img alt="Local only" src="https://img.shields.io/badge/deployment-local%20only-F59E0B">
</p>

> [!NOTE]
> **A local demo build, not a production store.** Ships with one seeded catalog (54 real products with real photography), an admin account, and three fictional demo customers — no real users, no real inventory. There is no hosted version and no real charges: checkout runs on Stripe **test mode** only. Embeddings are generated locally via Ollama and never leave your machine; the only outbound AI call is to OpenRouter, and only when you use the chat assistant. See [Known limitations](#-known-limitations) for what's intentionally simplified.

---

## 📑 Table of contents

- [Why it exists](#-why-it-exists)
- [Features](#-features)
- [Tech stack](#-tech-stack)
- [How the core features work](#-how-the-core-features-work)
- [Architecture](#-architecture)
- [Security model](#-security-model)
- [Getting started](#-getting-started)
- [Known limitations](#-known-limitations)

---

## 🎯 Why it exists

Most e-commerce demo templates stop at a product grid and a fake "Add to cart" button — gray placeholder boxes, Lorem ipsum descriptions, and a "recommendations" row that's really just "same category, sorted by newest." Nudge is the opposite bet: real photography for every one of its 54 products, real written copy, and recommendations + search that are actually powered by vector embeddings rather than a category filter wearing an AI label.

It's also a deliberate visual departure from the generic dashboard/SaaS look — a serif display font, warm terracotta-and-cream palette, hairline borders instead of drop shadows, and a shared-element image transition between the product grid and detail page, because a storefront should feel like a boutique, not an admin panel.

---

## ✨ Features

### 🛍️ Catalog & shopping

| Feature | What it does |
|---|---|
| **Product catalog** | Grid + detail pages across 6 categories (candles, planters, ceramics, textiles, wall decor, storage), each with a real name, description, price, and photograph. |
| **Shared-element product transition** | Clicking a product card morphs its image straight into the detail view (Framer Motion `layoutId` + a Next.js intercepting route) instead of a hard page cut. |
| **Cart** | Slide-in drawer with spring physics; persists to Postgres for logged-in customers and to `localStorage` for guests, merged automatically on login. |
| **Wishlist** | Heart-to-save on any product card, with a dedicated wishlist page for logged-in customers. |

### 🔍 Search & AI

| Feature | What it does |
|---|---|
| **Semantic search** | A query like *"cozy warm blanket for a reading nook"* is embedded locally via Ollama and matched against every product's embedding with `pgvector` cosine similarity — merged with a keyword fallback so exact-name searches still work. |
| **"You might also like"** | Each product detail page shows 4–6 similar items ranked by embedding distance against every other product — not a category filter. |
| **AI shopping assistant** | A chat widget where OpenRouter function-calls a server-side `search_products(query, category?, max_price?)` tool that runs the same embedding search, then references the real results conversationally and renders them as inline product cards. |
| **Personalized homepage** | Logged-in customers see their category rows reordered by their own purchase + wishlist history. |

### 💳 Checkout & orders

| Feature | What it does |
|---|---|
| **Multi-step checkout** | Shipping → payment → confirm, with an animated progress indicator and a Stripe `PaymentElement` restyled to match the app's theme (not Stripe's default blue). |
| **Discount codes** | Admin-created percent-off codes, validated live at checkout and applied to the order total. |
| **Order history** | Every past order with its line items, status, and totals, on a dedicated account page. |

### ⭐ Reviews

| Feature | What it does |
|---|---|
| **Star rating + written review** | Customers can review a product only after purchasing it (enforced server-side against their order history), with an animated fill-on-hover star input. |

### 🔐 Accounts & admin

| Feature | What it does |
|---|---|
| **Two auth flows** | Separate customer (`/login`) and admin (`/admin/login`) sign-in, backed by one `users` table with a `role` column checked server-side on every request — not just hidden in the UI. |
| **Admin product CRUD** | Full create/edit/delete, with the product's embedding automatically regenerated whenever its name, description, or category changes. |
| **Low-stock badges** | Color-coded (red / amber / green) stock indicators on the admin product list. |
| **Discount code management** | Create, activate/deactivate, and delete percent-off codes. |
| **Abandoned-cart activity log** | If a cart sits untouched, a mock "reminder email" event is logged to the server console and an admin-visible Activity page — no real email is ever sent, since this app isn't deployed. |

### 🎨 Polish

| Feature | What it does |
|---|---|
| **Dark mode** | Full working toggle (warm cream light theme / charcoal dark theme); light is the default. |
| **Toasts & skeletons** | Every mutating action shows a toast; every loading state uses a shimmer skeleton, never a bare spinner. |
| **Motion everywhere** | Every hover, tap, add-to-cart, and page transition uses Framer Motion — nothing is a static UI element. |

---

## 🛠 Tech stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | API routes, Server/Client Components, and parallel/intercepting routes (for the shared-element modal) in one app. |
| **UI** | Tailwind CSS, Framer Motion, lucide-react, shadcn-style primitives | An editorial, boutique look — generous whitespace, hairline borders, `rounded-lg` corners, not a generic dashboard aesthetic. |
| **Language** | TypeScript 5 (strict) | |
| **Database** | PostgreSQL + `pgvector` | Local Docker container; raw parameterized SQL via `pg`, no ORM, so `<=>` cosine-distance queries stay simple and explicit. |
| **Auth** | Custom JWT session cookies (`jose`), bcrypt password hashing | Self-contained — no external auth provider needed for a local-only tool, with two independently-checked roles. |
| **Payments** | Stripe (test mode) | Real `PaymentIntent` + `PaymentElement` flow, styled to the app's theme, no real charges. |
| **Embeddings** | Ollama, `nomic-embed-text` (768-dim), local | Recommendations and semantic search run entirely offline — no embedding API key required. |
| **Chat AI** | OpenRouter (OpenAI-compatible), default `openai/gpt-4o-mini` | Function-calling shopping assistant; the only feature that makes an external AI call. |
| **Fonts** | Fraunces (display) + Inter (body), via `next/font/google` | The serif/sans pairing that sets the premium-lifestyle tone. |

---

## ⚙️ How the core features work

### 🧭 Search and recommendations share one embedding pipeline
`lib/embeddings.ts` calls Ollama's local `/api/embeddings` endpoint for both indexing and querying. At seed time (and whenever an admin edits a product's name/description/category), `name + category + description` is embedded and stored in `products.embedding vector(768)`. Semantic search embeds the user's query the same way and ranks all products by `embedding <=> query` (cosine distance) in Postgres; recommendations rank every other product against the current one's own embedding. Both merge with a plain keyword/category fallback so the feature degrades gracefully instead of breaking if Ollama is briefly unreachable.

### 🖼️ The shared-element transition is a real route, not a CSS trick
`app/@modal/(.)products/[id]/page.tsx` is a Next.js *intercepting route*: clicking a product card client-side navigates to `/products/[id]` but renders it as an overlay on top of the still-mounted grid, while a `motion.div layoutId="product-image-{id}"` shared between the card and the modal lets Framer Motion morph the image between the two positions. A hard refresh or direct link still renders the plain, non-modal detail page.

### 💬 The shopping assistant is grounded in the real catalog
`app/api/ai/chat/route.ts` sends the conversation to OpenRouter with one tool, `search_products`. When the model calls it, the route runs the exact same Ollama-embedding + `pgvector` search used by `/api/search` server-side, feeds the (real) results back to the model as a tool response, and only then asks it to reply — so the assistant can't invent products that aren't in the database.

### 🔑 Roles and purchase history are checked on the server, not just hidden in the UI
`middleware.ts` redirects any unauthenticated request to `/admin/*` before it renders, and every `/api/admin/*` route independently re-checks `session.role === "admin"`. The same pattern gates reviews: the "Leave a review" form is always visible, but `POST /api/reviews` rejects it server-side unless the customer's own `order_items` actually contain that product.

---

## 🏗 Architecture

```
app/
├── login/ signup/            Customer auth pages
├── admin/login/               Separate admin auth page
├── products/ products/[id]/   Catalog grid + full detail page
├── @modal/(.)products/[id]/   Intercepted route powering the shared-element modal
├── search/                    Semantic search page
├── checkout/ checkout/success/  Multi-step checkout + confirmation
├── account/orders/ wishlist/  Customer account pages
├── admin/ admin/products/ admin/discounts/ admin/activity/  Admin dashboard
└── api/
    ├── auth/                  Signup, customer login, admin login, logout, session
    ├── products/               List, detail, embedding-similarity recommendations
    ├── search/                 Semantic + keyword product search
    ├── cart/ wishlist/ reviews/ orders/ discount/  Customer-facing CRUD
    ├── checkout/               Stripe PaymentIntent creation + confirmation
    ├── ai/chat/                 OpenRouter function-calling shopping assistant
    ├── personalize/             Purchase/wishlist-based category ordering
    └── admin/                   Product CRUD, discount codes, abandoned-cart log
components/
├── ui/                        Restyled primitives (button, input, card, badge…)
├── nav/                       Header, cart drawer, footer
├── product/                   Card, gallery, detail, reviews, recommendations
├── checkout/                  Progress steps, Stripe card form
├── chat/                      Shopping assistant widget
└── admin/                     Product form, admin nav
context/                       Auth, cart, toast, and theme providers
lib/
├── db.ts                      pg Pool + query helpers, pgvector literal encoding
├── auth.ts / session.ts       JWT session creation/verification, password hashing
├── embeddings.ts               Local Ollama embedding calls
├── openrouter.ts                Chat completion + function-calling
└── stripe.ts                   Stripe client
db/schema.sql                  Full Postgres schema, incl. the pgvector index
scripts/
├── seed.ts                    One-command demo data seeder
└── seed-data.ts                The 54 seeded products
```

### Data model

| Table | Purpose |
|---|---|
| `users` | Customers and admins, one `role` column, bcrypt password hash |
| `products` | Catalog rows, incl. `embedding vector(768)` |
| `reviews` | Star rating + comment, one per purchased product per customer |
| `orders`, `order_items` | Order headers and line items, priced at time of purchase |
| `cart_items` | Persisted cart for logged-in customers (guests use `localStorage`) |
| `wishlists` | Saved products per customer |
| `discount_codes` | Admin-managed percent-off codes with optional expiry |

---

## 🛡 Security model

| Control | Implementation |
|---|---|
| **Sessions** | httpOnly, signed JWT cookies (`jose`), 30-day expiry. No token in `localStorage`. |
| **Passwords** | bcrypt, 10 rounds. Never returned in any API response. |
| **Role checks** | Every `/api/admin/*` route independently re-verifies `role === "admin"` server-side — a customer can't reach admin data by guessing a URL. |
| **Review gating** | `POST /api/reviews` checks the customer's own `order_items` before accepting a review — the form being visible isn't the actual gate. |
| **Middleware** | `middleware.ts` redirects unauthenticated `/admin/*` page requests to `/admin/login` before anything renders. |
| **Checkout pricing** | Order totals are computed server-side from the customer's actual `cart_items` and a validated discount code — never trusted from client input. |
| **No external credentials requested** | Signup only ever asks for a name, email, and password. |

---

## 🚀 Getting started

**Prerequisites:** Node.js 18.18+, Docker (for the local Postgres container), [Ollama](https://ollama.com) running locally with `nomic-embed-text` pulled, and — optionally — free API keys for [OpenRouter](https://openrouter.ai/keys) (chat assistant), [Stripe test mode](https://dashboard.stripe.com/test/apikeys), and [Unsplash](https://unsplash.com/developers) (seed photography).

```bash
ollama pull nomic-embed-text   # local embedding model (make sure Ollama is running)

npm install
cp .env.example .env            # fill in AUTH_SECRET + your API keys
docker compose up -d            # starts a local Postgres + pgvector container
npm run seed                    # fetches photos, generates embeddings, seeds everything
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo login credentials

All seeded accounts share the password `password123`:

| Email | Role |
|---|---|
| `admin@nudge.shop` | admin — sign in at `/admin/login` |
| `amelia@example.com` | customer |
| `bennett@example.com` | customer |
| `clara@example.com` | customer |

> [!TIP]
> Test checkout with Stripe's standard test card: `4242 4242 4242 4242`, any future expiry, any CVC/ZIP. Discount codes `WELCOME10`, `NUDGE20`, and `FLASH25` are pre-seeded and ready to apply.

### Useful scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server at localhost:3000 |
| `npm run build` / `npm run start` | Production build and start |
| `npm run seed` | Reset and re-seed the full demo catalog, accounts, and orders |

---

## ⚠️ Known limitations

- **Single store, not multi-tenant.** There's one catalog and one admin role — Nudge doesn't isolate multiple sellers or workspaces.
- **No real email.** Team/order confirmations and the abandoned-cart "reminder email" are logged to the console and the admin Activity page only, since this app is never deployed.
- **Embedding dimension is tied to the model.** The `products.embedding` column is `vector(768)` to match `nomic-embed-text`. Switching `OLLAMA_EMBED_MODEL` to a model with a different output size requires updating `EMBEDDING_DIM` in `lib/embeddings.ts` and the column definition in `db/schema.sql`, then re-seeding.
- **No image upload pipeline.** Admin product photos are set by pasting an image URL — there's no file upload/storage step, which is out of scope for a local demo.
- **Unsplash fetching is best-effort.** Without `UNSPLASH_ACCESS_KEY`, or if its free-tier rate limit is hit mid-seed, some product photos may not download; re-running `npm run seed` resumes and skips images already saved.
- **Payments are test-mode only.** No real charges are possible, and the app isn't wired to Stripe Connect, webhooks, or a live account.
