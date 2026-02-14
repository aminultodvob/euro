import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24;

type SessionPayload = {
  role: "admin";
};

function getSecret() {
  const passcode = process.env.ADMIN_PANEL_PASSCODE;
  if (!passcode) {
    throw new Error("Missing ADMIN_PANEL_PASSCODE environment variable.");
  }
  return new TextEncoder().encode(passcode);
}

export async function createAdminSessionToken() {
  const secret = getSecret();
  return await new SignJWT({ role: "admin" } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secret);
}

export async function verifyAdminSessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}
