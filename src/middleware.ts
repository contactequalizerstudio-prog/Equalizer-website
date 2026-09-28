import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { adminRouteNeedsAuth, isAdminApiPath } from "@/lib/admin-route-guard";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Forward pathname as a REQUEST header so root layout can read it via headers()
  // (setting it on the request avoids interfering with API response headers)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (!adminRouteNeedsAuth(pathname)) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? await verifyToken(token) : null;
  if (payload) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // /api/admin is not covered by the /admin page check. Reject it with 401
  // so an unauthenticated fetch cannot read or delete hostess records.
  if (isAdminApiPath(pathname)) {
    const res = NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    if (token) res.cookies.delete(COOKIE_NAME);
    return res;
  }

  const res = NextResponse.redirect(new URL("/admin/login", request.url));
  if (token) res.cookies.delete(COOKIE_NAME);
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf)).*)",
  ],
};
