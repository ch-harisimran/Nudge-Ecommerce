import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { getStripe } from "@/lib/stripe";

// Phase 1, feature 3: creates a Stripe test-mode PaymentIntent plus a
// "pending" order record priced authoritatively from the server-side cart.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in to check out." }, { status: 401 });

  const { shipping, discountCode } = await req.json();
  if (!shipping?.name || !shipping?.address || !shipping?.city || !shipping?.zip) {
    return NextResponse.json({ error: "Please complete the shipping address." }, { status: 400 });
  }

  const cartRows = await query<{ product_id: string; quantity: number; price: string; stock_qty: number; name: string }>(
    `SELECT c.product_id, c.quantity, p.price, p.stock_qty, p.name
     FROM cart_items c JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1`,
    [user.sub]
  );
  if (cartRows.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  for (const row of cartRows) {
    if (row.quantity > row.stock_qty) {
      return NextResponse.json({ error: `Not enough stock for ${row.name}.` }, { status: 409 });
    }
  }

  const subtotal = cartRows.reduce((sum, r) => sum + parseFloat(r.price) * r.quantity, 0);

  let percentOff = 0;
  let appliedCode: string | null = null;
  if (discountCode) {
    const discount = await queryOne<{ code: string; percent_off: number; active: boolean; expires_at: string | null }>(
      `SELECT code, percent_off, active, expires_at FROM discount_codes WHERE UPPER(code) = UPPER($1)`,
      [discountCode]
    );
    if (discount && discount.active && (!discount.expires_at || new Date(discount.expires_at) > new Date())) {
      percentOff = discount.percent_off;
      appliedCode = discount.code;
    }
  }
  const discountAmount = Math.round(subtotal * (percentOff / 100) * 100) / 100;
  const total = Math.max(0, subtotal - discountAmount);

  try {
    const order = await queryOne<{ id: string }>(
      `INSERT INTO orders (user_id, status, subtotal, discount_code, discount_amount, total, shipping_name, shipping_address, shipping_city, shipping_zip)
       VALUES ($1, 'pending', $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [user.sub, subtotal, appliedCode, discountAmount, total, shipping.name, shipping.address, shipping.city, shipping.zip]
    );
    if (!order) return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });

    for (const row of cartRows) {
      await query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)`,
        [order.id, row.product_id, row.quantity, row.price]
      );
    }

    const stripe = getStripe();
    const amountInCents = Math.round(total * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.max(amountInCents, 50), // Stripe minimum
      currency: "usd",
      metadata: { orderId: order.id, userId: user.sub },
      automatic_payment_methods: { enabled: true },
    });

    await query(`UPDATE orders SET stripe_payment_intent_id = $1 WHERE id = $2`, [paymentIntent.id, order.id]);

    return NextResponse.json({
      orderId: order.id,
      clientSecret: paymentIntent.client_secret,
      subtotal,
      discountAmount,
      total,
    });
  } catch (err) {
    console.error("Checkout failed:", (err as Error).message);
    return NextResponse.json(
      { error: "Could not start checkout. Make sure STRIPE_SECRET_KEY is set to a valid Stripe test-mode key." },
      { status: 500 }
    );
  }
}
