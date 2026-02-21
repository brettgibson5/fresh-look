import { AppIconGrid } from "@/components/app-icon-grid";
import { PACKING_ICONS } from "@/lib/icon-grids";
import { requireRole } from "@/lib/auth/server";

export default async function ManagementPackingPage() {
  await requireRole(["management", "admin"]);

  return <AppIconGrid icons={PACKING_ICONS} />;
}
