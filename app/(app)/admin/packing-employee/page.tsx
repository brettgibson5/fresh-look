import { AppIconGrid } from "@/components/app-icon-grid";
import { PACKING_ICONS } from "@/lib/icon-grids";
import { requireRole } from "@/lib/auth/server";

export default async function AdminPackingPage() {
  await requireRole(["admin"]);

  return <AppIconGrid icons={PACKING_ICONS} />;
}
