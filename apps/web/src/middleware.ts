import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@nextplate/api/lib/auth.js";
import { NextResponse, type NextRequest } from "next/server";

const authRoutes = [
  "/signin",
  "/signup",
  "/reset-password",
  "/forgot-password",
  "/email-verified"
];

const protectedRoutes = ["/dashboard"];

export default async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedPath = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (authRoutes.includes(pathname) || isProtectedPath) {
    // Fetch session
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: {
          //get the cookie from the request
          cookie: request.headers.get("cookie") || ""
        }
      }
    );

    // If Auth route and Already authenticated,
    // Redirect back to dashboard
    if (authRoutes.includes(pathname) && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If Dashboard route and Not authenticated,
    // Redirect back to signin
    if (isProtectedPath && !session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
