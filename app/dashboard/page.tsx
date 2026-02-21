import { redirect } from "next/navigation";
import { ROLE_DASHBOARD_PATHS } from "@/lib/auth/roles";
import { requireAuth } from "@/lib/auth/server";

export default async function DashboardIndexPage() {
  const context = await requireAuth();
  redirect(ROLE_DASHBOARD_PATHS[context.role]);
}
