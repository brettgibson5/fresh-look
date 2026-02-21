import { requireRole } from "@/lib/auth/server";

export default async function SanitationDashboardPage() {
  await requireRole(["sanitation", "management", "admin"]);

  return (
    <div>
      <h2 className="text-2xl font-semibold">Sanitation</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        Phase 3: sanitation workflows are intentionally deferred in Phase 2 MVP.
      </p>
    </div>
  );
}
