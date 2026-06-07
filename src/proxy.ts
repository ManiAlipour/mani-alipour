import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/", "/projects", "/blogs", "/about", "/contact"];

const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];

const API_AUTH_PREFIX = "/api/auth";

const ADMIN_ROUTE = "/admin";
const DASHBOARD_ROUTE = "/dashboard";

type JWTPayload = {
  id: string;
  email: string;
  role: "admin" | "user";
};

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;

  // =========================
  // Public Routes
  // =========================

  const isPublicRoute = PUBLIC_ROUTES.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(route);
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // =========================
  // Auth API Routes
  // =========================

  if (pathname.startsWith(API_AUTH_PREFIX)) {
    return NextResponse.next();
  }

  // =========================
  // Auth Pages
  // =========================

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute && token) {
    const decoded = await verifyToken(token);

    if (decoded?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // =========================
  // Protected Routes
  // =========================

  const isProtectedRoute =
    pathname.startsWith(DASHBOARD_ROUTE) || pathname.startsWith(ADMIN_ROUTE);

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // =========================
  // No Token
  // =========================

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // =========================
  // Verify Token
  // =========================

  const decoded = await verifyToken(token);

  if (!decoded) {
    const response = NextResponse.redirect(new URL("/auth/signin", req.url));

    response.cookies.delete("token");

    return response;
  }

  // =========================
  // Role Based Access
  // =========================

  if (pathname.startsWith(ADMIN_ROUTE) && decoded.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith(DASHBOARD_ROUTE) && decoded.role === "admin") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * اجرا روی همه route ها
     * به جز:
     * - static files
     * - images
     * - favicon
     */

    "/((?!_next/static|_next/image|favicon.ico|images|assets).*)",
  ],
};
