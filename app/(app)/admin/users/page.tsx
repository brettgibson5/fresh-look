import { requireRole } from "@/lib/auth/server";
import { listProfiles } from "@/lib/data/users";
import { UsersTable } from "./users-table";

export default async function AdminUsersPage() {
  await requireRole(["admin"]);
  const profiles = await listProfiles();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">User Management</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Manage user accounts, roles, and access.
        </p>
      </div>
      <UsersTable profiles={profiles} />
    </div>
  );
}
