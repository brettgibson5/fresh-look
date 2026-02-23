import { AppIconGrid } from "@/components/app-icon-grid";
import { ADMIN_ICONS } from "@/lib/icon-grids";
import { requireRole } from "@/lib/auth/server";

export default async function AdminPage() {
  await requireRole(["admin"]);

  return (
    <div>
      <h2 className="text-2xl font-semibold">Admin</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        Select a tool to get started.
      </p>
      <div className="mt-8">
        <AppIconGrid icons={ADMIN_ICONS} />
      </div>
    </div>
  );
}
