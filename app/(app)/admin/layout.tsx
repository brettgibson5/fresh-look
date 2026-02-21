import { requireRole } from "@/lib/auth/server";
import { RoleTabNav } from "@/components/role-tab-nav";

const ADMIN_TABS = [
  { label: "Growers", href: "/admin/growers" },
  { label: "Packing Employee", href: "/admin/packing-employee" },
  { label: "Admin", href: "/admin/users" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["admin"]);

  return (
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight">Admin</h2>
      <p className="text-muted-foreground mt-1 mb-6 text-sm">
        Manage views and user role assignments.
      </p>
      <RoleTabNav tabs={ADMIN_TABS} />
      {children}
    </div>
  );
}
