import { NextResponse } from "next/server";

async function createToken(password: string) {
  const data = new TextEncoder().encode(`lungnuad-studio:${password}:v1`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const expectedPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "Admin" : "");

  if (!expectedPassword || body?.password !== expectedPassword) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("ln_studio_auth", await createToken(expectedPassword), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
