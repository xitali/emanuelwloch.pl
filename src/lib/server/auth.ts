import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getJwtSecret } from "@/lib/server/env";
import { isAdminCredentialCurrent, type AdminCredential } from "@/lib/server/turso";

const COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Host-admin_session"
    : "admin_session";
const ISSUER = "emanuelwloch.pl";
const AUDIENCE = "emanuelwloch.pl/admin";
const MOBILE_AUDIENCE = "emanuelwloch.pl/android-admin";
const SESSION_SECONDS = 60 * 60 * 8;
export const MOBILE_SESSION_SECONDS = 60 * 60 * 24 * 30;

export async function createAdminSession(credential: AdminCredential) {
  const token = await new SignJWT({ role: "admin", cv: credential.credentialVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(credential.id)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setJti(crypto.randomUUID())
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(getJwtSecret());

  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_SECONDS,
    path: "/",
  });
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;

    const verified = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return verified.payload.role === "admin" && await credentialIsCurrent(verified.payload);
  } catch {
    return false;
  }
}

export async function createMobileAdminToken(credential: AdminCredential): Promise<string> {
  return new SignJWT({ role: "admin", client: "android", cv: credential.credentialVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(credential.id)
    .setIssuer(ISSUER)
    .setAudience(MOBILE_AUDIENCE)
    .setJti(crypto.randomUUID())
    .setIssuedAt()
    .setExpirationTime(`${MOBILE_SESSION_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifyMobileAdminToken(
  authorizationHeader: string | null,
): Promise<boolean> {
  try {
    if (!authorizationHeader?.startsWith("Bearer ")) return false;
    const token = authorizationHeader.slice("Bearer ".length).trim();
    if (!token) return false;

    const verified = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: MOBILE_AUDIENCE,
    });

    return (
      verified.payload.role === "admin" &&
      verified.payload.client === "android" &&
      await credentialIsCurrent(verified.payload)
    );
  } catch {
    return false;
  }
}

export async function logoutAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete("admin_token");
}

async function credentialIsCurrent(payload: { sub?: string; cv?: unknown }): Promise<boolean> {
  if (!payload.sub || !Number.isSafeInteger(payload.cv) || Number(payload.cv) < 0) return false;
  return isAdminCredentialCurrent(payload.sub, Number(payload.cv));
}
