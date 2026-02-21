import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

function redirectWithCookies(url: URL, response: NextResponse) {
  const redirectResponse = NextResponse.redirect(url);

  response.cookies.getAll().forEach(({ name, value, ...rest }) => {
    redirectResponse.cookies.set(name, value, rest);
  });

  return redirectResponse;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isLoginRoute = pathname === "/login";

  const { response, user } = await updateSession(request);

  if (isDashboardRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return redirectWithCookies(url, response);
  }

  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return redirectWithCookies(url, response);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
