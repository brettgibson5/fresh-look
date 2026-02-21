import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  isUserRole,
  ROLE_DASHBOARD_PATHS,
  type UserRole,
} from "@/lib/auth/roles";

export type AuthContext = {
  userId: string;
  role: UserRole;
};

export const getAuthContext = cache(async (): Promise<AuthContext | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const roleValue = data?.role;

  if (typeof roleValue !== "string" || !isUserRole(roleValue)) {
    return null;
  }

  return {
    userId: user.id,
    role: roleValue,
  };
});

export async function requireAuth(): Promise<AuthContext> {
  const context = await getAuthContext();

  if (!context) {
    redirect("/login");
  }

  return context;
}

export async function requireRole(
  allowedRoles: UserRole[],
): Promise<AuthContext> {
  const context = await requireAuth();

  if (!allowedRoles.includes(context.role)) {
    redirect(ROLE_DASHBOARD_PATHS[context.role]);
  }

  return context;
}
