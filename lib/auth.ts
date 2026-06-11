import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "nobur_admin";

type SessionPayload = {
  id: number;
  username: string;
  nickname: string | null;
  exp: number;
};

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET.");
  }
  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export async function verifyPassword(password: string, stored: string) {
  if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
    return bcrypt.compare(password, stored);
  }

  return password === stored;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function createSessionCookie(payload: Omit<SessionPayload, "exp">) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const raw = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  return `${raw}.${sign(raw)}`;
}

export async function readSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!cookie) return null;

  const [raw, signature] = cookie.split(".");
  if (!raw || !signature) return null;

  const expected = sign(raw);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setSession(value: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function requireAdmin() {
  const session = await readSession();
  if (!session) redirect("/login");
  return session;
}

export async function login(username: string, password: string) {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminNickname = process.env.ADMIN_NICKNAME || "管理者";
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const passwordMatches = adminPasswordHash
    ? await verifyPassword(password, adminPasswordHash)
    : adminPassword
      ? password === adminPassword
      : password === "671230";

  if (username !== adminUsername || !passwordMatches) {
    return null;
  }

  return createSessionCookie({
    id: 1,
    username: adminUsername,
    nickname: adminNickname
  });
}
