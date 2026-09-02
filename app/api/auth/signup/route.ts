import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query, queryOne } from "@/lib/db";
import { hashPassword, signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a valid name, email, and a password of at least 6 characters." }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  const existing = await queryOne(`SELECT id FROM users WHERE email = $1`, [email.toLowerCase()]);
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const hash = await hashPassword(password);
  const user = await queryOne<{ id: string; email: string; name: string; role: string }>(
    `INSERT INTO users (email, name, password_hash, role) VALUES ($1, $2, $3, 'customer') RETURNING id, email, name, role`,
    [email.toLowerCase(), name, hash]
  );
  if (!user) return NextResponse.json({ error: "Could not create account." }, { status: 500 });

  const token = await signSession({ sub: user.id, email: user.email, name: user.name, role: "customer" });
  const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", maxAge: SESSION_MAX_AGE, path: "/" });
  return res;
}
