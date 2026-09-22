
// proxy.ts
// Project root এ, app/ এর বাইরে

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;

  const pathname = nextUrl.pathname;
  const session = req.auth;

  const isAuthenticated = !!session?.user;

  const role = session?.user?.role;
  const status = session?.user?.status;

  const isSuperAdmin = pathname.startsWith("/superadmin");
  const isPrivate = pathname.startsWith("/private");

  // ============================================
  // SUPER ADMIN ROUTES
  // ============================================

  if (isSuperAdmin) {
    // Not logged in
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", nextUrl);

      loginUrl.searchParams.set(
        "callbackUrl",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }

    // Only approved superadmin
    if (
      role !== "superadmin" ||
      status !== "approved"
    ) {
      return NextResponse.redirect(
        new URL("/forbidden", nextUrl)
      );
    }
  }

  // ============================================
  // NORMAL USER ROUTES
  // ============================================

  if (isPrivate) {
    // Not logged in
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", nextUrl);

      loginUrl.searchParams.set(
        "callbackUrl",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }

    // Only approved users
    if (status !== "approved") {
      return NextResponse.redirect(
        new URL("/pending", nextUrl)
      );
    }

    // Superadmin should use superadmin dashboard
    if (role === "superadmin") {
      return NextResponse.redirect(
        new URL("/superadmin", nextUrl)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/superadmin/:path*",
    "/private/:path*",
  ],
};
