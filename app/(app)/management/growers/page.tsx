import { AppIconGrid } from "@/components/app-icon-grid";
import { GROWERS_ICONS } from "@/lib/icon-grids";
import { requireRole } from "@/lib/auth/server";

export default async function ManagementGroversPage() {
  await requireRole(["management", "admin"]);

  return <AppIconGrid icons={GROWERS_ICONS} />;
}
