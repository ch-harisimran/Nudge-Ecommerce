import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { getStripe } from "@/lib/stripe";

// Verifies the PaymentIntent succeeded, marks the order paid, decrements
// stock, and clears the customer's cart.
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const { orderId } = await req.json();
  const order = await queryOne<{ id: string; stripe_payment_intent_id: string; status: string }>(
    `SELECT id, stripe_payment_intent_id, status FROM orders WHERE id = $1 AND user_id = $2`,
    [orderId, user.sub]
  );
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (order.status === "paid") return NextResponse.json({ ok: true, alreadyPaid: true });

  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(order.stripe_payment_intent_id);
    if (intent.status !== "succeeded") {
      return NextResponse.json({ error: `Payment not completed (status: ${intent.status}).` }, { status: 402 });
    }

    const items = await query<{ product_id: string; quantity: number }>(
      `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
      [order.id]
    );
    for (const item of items) {
      await query(`UPDATE products SET stock_qty = GREATEST(0, stock_qty - $1) WHERE id = $2`, [item.quantity, item.product_id]);
    }

    await query(`UPDATE orders SET status = 'paid' WHERE id = $1`, [order.id]);
    await query(`DELETE FROM cart_items WHERE user_id = $1`, [user.sub]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Order confirmation failed:", (err as Error).message);
    return NextResponse.json({ error: "Could not confirm your payment. Please try again." }, { status: 500 });
  }
}
