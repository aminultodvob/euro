import { NextResponse } from "next/server";

import { ADMIN_COOKIE_NAME, createAdminSessionToken } from "@/lib/admin-session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { passcode?: string } | null;
  const inputPasscode = body?.passcode?.trim();
  const expectedPasscode = process.env.ADMIN_PANEL_PASSCODE;

  if (!expectedPasscode) {
    return NextResponse.json({ error: "Server is missing ADMIN_PANEL_PASSCODE." }, { status: 500 });
  }
  if (!inputPasscode || inputPasscode !== expectedPasscode) {
    return NextResponse.json({ error: "Invalid passcode." }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}
