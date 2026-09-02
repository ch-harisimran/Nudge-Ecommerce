import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Enter a discount code." }, { status: 400 });

  const discount = await queryOne<{ code: string; percent_off: number; active: boolean; expires_at: string | null }>(
    `SELECT code, percent_off, active, expires_at FROM discount_codes WHERE UPPER(code) = UPPER($1)`,
    [code.trim()]
  );

  if (!discount || !discount.active) {
    return NextResponse.json({ error: "That code isn't valid." }, { status: 404 });
  }
  if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
    return NextResponse.json({ error: "That code has expired." }, { status: 410 });
  }

  return NextResponse.json({ code: discount.code, percentOff: discount.percent_off });
}
