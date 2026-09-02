import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const { active } = await req.json();
  const code = await queryOne(
    `UPDATE discount_codes SET active = $1 WHERE id = $2 RETURNING id, code, percent_off, active, expires_at`,
    [active, params.id]
  );
  return NextResponse.json({ code });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  await query(`DELETE FROM discount_codes WHERE id = $1`, [params.id]);
  return NextResponse.json({ ok: true });
}
