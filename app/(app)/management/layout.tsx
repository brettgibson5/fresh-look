import { requireRole } from "@/lib/auth/server";
import { RoleTabNav } from "@/components/role-tab-nav";

const MANAGEMENT_TABS = [
  { label: "Growers", href: "/management/growers" },
  { label: "Packing Employee", href: "/management/packing-employee" },
];

export default async function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["management", "admin"]);

  return (
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight">Management</h2>
      <p className="text-muted-foreground mt-1 mb-6 text-sm">
        Select a view to manage your team.
      </p>
      <RoleTabNav tabs={MANAGEMENT_TABS} />
      {children}
    </div>
  );
}
