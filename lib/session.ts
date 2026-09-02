import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken, type SessionPayload } from "./auth";

export async function getSessionUser(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireCustomer(): Promise<SessionPayload> {
  const user = await getSessionUser();
  if (!user) throw new AuthError("Not authenticated", 401);
  return user;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") throw new AuthError("Admin access required", 403);
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
