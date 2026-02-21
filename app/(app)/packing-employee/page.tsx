import { AppIconGrid } from "@/components/app-icon-grid";
import { PACKING_ICONS } from "@/lib/icon-grids";
import { requireRole } from "@/lib/auth/server";

export default async function PackingEmployeeDashboardPage() {
  await requireRole(["packing_employee", "management", "admin"]);

  return (
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight">
        Packing Employee
      </h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Select an app to get started.
      </p>
      <div className="mt-8">
        <AppIconGrid icons={PACKING_ICONS} />
      </div>
    </div>
  );
}
