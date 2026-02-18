import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isTheme, type Theme } from "./theme/theme";

export function proxy(request: NextRequest) {
  const raw = request.cookies.get("theme")?.value;
  const theme: Theme = isTheme(raw) ? raw : "system";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-theme", theme);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set("x-theme", theme);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
