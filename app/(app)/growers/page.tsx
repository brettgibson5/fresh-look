import { AppIconGrid } from "@/components/app-icon-grid";
import { GROWERS_ICONS } from "@/lib/icon-grids";
import { requireRole } from "@/lib/auth/server";

export default async function GrowersDashboardPage() {
  await requireRole(["growers", "management", "admin"]);

  return (
    <div>
      <h2 className="text-2xl font-semibold">Growers</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        Select an app to get started.
      </p>
      <div className="mt-8">
        <AppIconGrid icons={GROWERS_ICONS} />
      </div>
    </div>
  );
}
