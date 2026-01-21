import { NextRequest, NextResponse } from "next/server";

function getHost(req: NextRequest): string {
  return (req.headers.get("host") || "").split(":")[0];
}

function getSubdomain(host: string): string {
  // Local: app.localhost, diag.localhost, check.localhost, localhost
  if (host.endsWith("localhost")) {
    if (host === "localhost") return "";
    return host.replace(".localhost", "");
  }

  // Dev/prod: app.pallad.fr, app.dev.pallad.fr, pallad.fr, dev.pallad.fr
  const parts = host.split(".");
  if (parts.length <= 2) return ""; // pallad.fr
  return parts[0]; // app / diag / check
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = getHost(req);
  const sub = getSubdomain(host);
  const PUBLIC_FILE = /\.(.*)$/;

  // Ignore public files (e.g. /pallad.svg, /robots.txt, /sitemap.xml, /favicon.ico)
  if (PUBLIC_FILE.test(url.pathname)) {
    return NextResponse.next();
  }

  // IMPORTANT: do not rewrite API calls; nginx/gateway should proxy /api/* to Django.
  // When hitting Next directly on :3000, /api/* may 404 and that's expected.
  if (url.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // IMPORTANT: do not rewrite internal site routes, otherwise we double-rewrite and 404.
  if (url.pathname.startsWith("/sites")) {
    return NextResponse.next();
  }

  // MARKETING (pallad.fr, dev.pallad.fr, localhost)
  if (host === "localhost" || host === "pallad.fr" || host === "dev.pallad.fr" || sub === "") {
    url.pathname = `/sites/marketing${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // APP (app.*)
  if (sub === "app") {
    url.pathname = `/sites/app${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // DIAG (diag.*)
  if (sub === "diag") {
    url.pathname = `/sites/diag${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // CHECK (check.*)
  if (sub === "check") {
    url.pathname = `/sites/check${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Fallback safety
  url.pathname = `/sites/marketing${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};