import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queryOne } from "@/lib/db";
import { verifyPassword, signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  const { email, password } = parsed.data;

  const user = await queryOne<{ id: string; email: string; name: string; role: string; password_hash: string }>(
    `SELECT id, email, name, role, password_hash FROM users WHERE email = $1 AND role = 'admin'`,
    [email.toLowerCase()]
  );
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: "Incorrect admin credentials." }, { status: 401 });
  }

  const token = await signSession({ sub: user.id, email: user.email, name: user.name, role: "admin" });
  const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", maxAge: SESSION_MAX_AGE, path: "/" });
  return res;
}
