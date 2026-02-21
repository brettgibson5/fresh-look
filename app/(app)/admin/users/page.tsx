import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROLE_LABELS, USER_ROLES, isUserRole } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/server";
import { listProfiles, updateProfileRole } from "@/lib/data/users";

async function updateRoleAction(formData: FormData) {
  "use server";

  await requireRole(["admin"]);

  const profileId = String(formData.get("profileId") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!profileId || !isUserRole(role)) {
    return;
  }

  await updateProfileRole({ profileId, role });
  revalidatePath("/admin/users");
}

export default async function AdminUsersPage() {
  await requireRole(["admin"]);
  const profiles = await listProfiles();

  return (
    <div>
      <h3 className="mb-4 font-semibold">User Role Management</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Current role</TableHead>
            <TableHead>Change role</TableHead>
            <TableHead className="text-right">ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>{profile.email ?? "No email"}</TableCell>
              <TableCell>{ROLE_LABELS[profile.role]}</TableCell>
              <TableCell>
                <form
                  action={updateRoleAction}
                  className="flex items-center gap-2"
                >
                  <input type="hidden" name="profileId" value={profile.id} />
                  <select
                    name="role"
                    defaultValue={profile.role}
                    className="bg-background h-9 rounded-md border px-2 text-sm"
                  >
                    {USER_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" size="sm" variant="outline">
                    Save
                  </Button>
                </form>
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {profile.id.slice(0, 8)}...
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
