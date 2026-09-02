import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getSessionUser } from "@/lib/session";

interface AbandonedCartEvent {
  id: number;
  userEmail: string;
  itemCount: number;
  subtotal: number;
  loggedAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __abandonedCartLog: AbandonedCartEvent[] | undefined;
}

const log = (global.__abandonedCartLog ??= []);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const event: AbandonedCartEvent = {
    id: log.length + 1,
    userEmail: body.userEmail || "guest",
    itemCount: body.itemCount || 0,
    subtotal: Number(body.subtotal || 0),
    loggedAt: new Date().toISOString(),
  };
  log.unshift(event);
  // eslint-disable-next-line no-console
  console.log(
    `[Nudge] Mock reminder email — cart abandoned by ${event.userEmail}: ${event.itemCount} item(s), subtotal $${event.subtotal.toFixed(2)}. (No real email sent — local demo only.)`
  );
  return NextResponse.json({ ok: true });
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  return NextResponse.json({ events: log.slice(0, 50) });
}
