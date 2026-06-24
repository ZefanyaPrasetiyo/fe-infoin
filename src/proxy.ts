import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboard = pathname.startsWith("/dashboard");
  const isBeranda = pathname.startsWith("/beranda");

  if (!token) {
    if (isDashboard || isBeranda) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  const role = token.role;

  if (isAuthPage) {
    if (role === "admin" || role === "petugas") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/beranda", request.url));
  }

  // 3. PEMBATASAN AKSES ROLE
  if (isDashboard && role === "user") {
    return NextResponse.redirect(new URL("/beranda", request.url));
  }

  if (isBeranda && (role === "admin" || role === "petugas")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/beranda/:path*"
  ],
};

export default proxy;