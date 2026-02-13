import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Fix duplicated X-Forwarded-Host header from Cloudflare + OpenLiteSpeed proxy chain
function fixProxyHeaders(request: NextRequest): NextResponse | null {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost && forwardedHost.includes(",")) {
    const cleanHost = forwardedHost.split(",")[0].trim();
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-forwarded-host", cleanHost);
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }
  return null;
}

export const proxy = auth((req) => {
  // Fix duplicate proxy headers first
  const headerFix = fixProxyHeaders(req);

  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const pathname = nextUrl.pathname;

  // Protected routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/login";

  // Redirect to login if accessing admin routes without auth
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Redirect to admin if already logged in and accessing login page
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  // Role-based access control for specific admin routes
  if (isAdminRoute && isLoggedIn && session?.user) {
    const role = session.user.role;

    // Block JAMAAH from admin
    if (role === "JAMAAH") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }

    // Finance routes - only ADMIN and BENDAHARA
    if (pathname.startsWith("/admin/keuangan") && !["ADMIN", "BENDAHARA"].includes(role)) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }

    // TPA routes - only ADMIN and PENGELOLA_TPA
    if (pathname.startsWith("/admin/tpa") && !["ADMIN", "PENGELOLA_TPA"].includes(role)) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
  }

  // Return header fix response if headers were modified, otherwise proceed
  return headerFix || NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all routes except static files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
