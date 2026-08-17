import { NextRequest, NextResponse } from "next/server";

async function createToken(password: string) {
  const data = new TextEncoder().encode(`lungnuad-studio:${password}:v1`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isStudioPage = pathname === "/studio" || pathname.startsWith("/studio/");
  const isStudioApi = pathname.startsWith("/api/studio/");
  const isLoginRoute = pathname === "/studio/login" || pathname === "/api/studio/login";

  if ((!isStudioPage && !isStudioApi) || isLoginRoute) return NextResponse.next();

  const password = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "Admin" : "");
  const received = request.cookies.get("ln_studio_auth")?.value;
  const authorized = password && received === await createToken(password);

  if (authorized) return NextResponse.next();

  if (isStudioApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/studio/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ["/studio/:path*", "/api/studio/:path*"] };
