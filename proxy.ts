import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { ROLE_DASHBOARD_PATHS, isUserRole } from "@/lib/auth/roles";

function redirectWithCookies(url: URL, response: NextResponse) {
  const redirectResponse = NextResponse.redirect(url);

  response.cookies.getAll().forEach(({ name, value, ...rest }) => {
    redirectResponse.cookies.set(name, value, rest);
  });

  return redirectResponse;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLoginRoute = pathname === "/login";

  const { response, user } = await updateSession(request);

  if (!isLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return redirectWithCookies(url, response);
  }

  if (isLoginRoute && user) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    });
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const rolePath =
      profile && isUserRole(profile.role)
        ? ROLE_DASHBOARD_PATHS[profile.role]
        : "/growers";

    const url = request.nextUrl.clone();
    url.pathname = rolePath;
    url.search = "";
    return redirectWithCookies(url, response);
  }

  return response;
}

export const config = {
  matcher: [
    "/growers/:path*",
    "/packing-employee/:path*",
    "/management/:path*",
    "/admin/:path*",
    "/settings/:path*",
    "/sanitation/:path*",
    "/login",
  ],
};
