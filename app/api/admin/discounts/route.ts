import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const codes = await query(`SELECT id, code, percent_off, active, expires_at FROM discount_codes ORDER BY code`);
  return NextResponse.json({ codes });
}

const schema = z.object({
  code: z.string().min(2),
  percent_off: z.number().int().min(1).max(100),
  expires_at: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please provide a code and a percent off between 1-100." }, { status: 400 });

  const existing = await queryOne(`SELECT id FROM discount_codes WHERE UPPER(code) = UPPER($1)`, [parsed.data.code]);
  if (existing) return NextResponse.json({ error: "That code already exists." }, { status: 409 });

  const created = await queryOne(
    `INSERT INTO discount_codes (code, percent_off, active, expires_at) VALUES ($1, $2, true, $3)
     RETURNING id, code, percent_off, active, expires_at`,
    [parsed.data.code.toUpperCase(), parsed.data.percent_off, parsed.data.expires_at || null]
  );
  return NextResponse.json({ code: created });
}
