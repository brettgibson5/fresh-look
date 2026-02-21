import { requireRole } from "@/lib/auth/server";
import { getManagementKpis, listRecentWorkItems } from "@/lib/data/work-items";

export default async function ManagementDashboardPage() {
  await requireRole(["management", "admin"]);
  const [kpis, recentItems] = await Promise.all([
    getManagementKpis(),
    listRecentWorkItems(8),
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold">Management</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        Live high-level status for quality pipeline throughput.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-xs">Total items</p>
          <p className="mt-2 text-2xl font-semibold">{kpis.total}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-xs">Pending</p>
          <p className="mt-2 text-2xl font-semibold">{kpis.pending}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-xs">Passed</p>
          <p className="mt-2 text-2xl font-semibold">{kpis.passed}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-xs">Pass rate</p>
          <p className="mt-2 text-2xl font-semibold">{kpis.passRate}%</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border p-4">
        <h3 className="font-medium">Recent items</h3>
        <div className="mt-3 space-y-2">
          {recentItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-md border p-3 text-sm"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-muted-foreground">Lot: {item.lot_code}</p>
              </div>
              <p className="text-muted-foreground">{item.status}</p>
            </div>
          ))}
          {recentItems.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No data available yet.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
