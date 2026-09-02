import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set. Add it to your .env file.");
    }
    // No explicit apiVersion pin — defaults to the version bundled with the
    // installed `stripe` package, avoiding TS literal-version mismatches.
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}
