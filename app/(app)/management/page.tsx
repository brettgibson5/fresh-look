import { requireRole } from "@/lib/auth/server";
import { ManagementTabs } from "./tabs";

export default async function ManagementDashboardPage() {
  await requireRole(["management", "admin"]);

  return (
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight">Management</h2>
      <p className="text-muted-foreground mt-1 mb-6 text-sm">
        Select a view to manage your team.
      </p>
      <ManagementTabs />
    </div>
  );
}
