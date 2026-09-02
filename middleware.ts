import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me");

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const token = req.cookies.get("nudge_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));

  try {
    const { payload } = await jwtVerify(token, SECRET);
    if ((payload as any).role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
