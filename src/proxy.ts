import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const publicPaths = ["/", "/privacy"];

const appPathPrefixes = ["/dashboard", "/history", "/settings"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || (path !== "/" && pathname.startsWith(path))
  );

  const hasLocalePrefix = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const isAppPath = appPathPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isPublicPath && !hasLocalePrefix) {
    return NextResponse.next();
  }

  if (isAppPath && !hasLocalePrefix) {
    return intlMiddleware(request);
  }

  if (hasLocalePrefix) {
    return intlMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
