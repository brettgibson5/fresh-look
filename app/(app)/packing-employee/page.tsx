import {
  CheckSquare,
  ClipboardList,
  History,
  Wrench,
} from "lucide-react";
import { AppIconGrid } from "@/components/app-icon-grid";
import { requireRole } from "@/lib/auth/server";

const PACKING_ICONS = [
  {
    label: "Packing Checklist",
    href: "/packing-checklist",
    icon: CheckSquare,
    color: "#3b82f6",
  },
  {
    label: "Operations",
    href: "/operations",
    icon: Wrench,
    color: "#8b5cf6",
  },
  {
    label: "Quality Control Form",
    href: "/quality-control-form",
    icon: ClipboardList,
    color: "#10b981",
  },
  {
    label: "History",
    href: "/history",
    icon: History,
    color: "#6b7280",
  },
];

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
