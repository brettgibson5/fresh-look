import {
  BarChart3,
  ClipboardCheck,
  PackageOpen,
  Settings,
} from "lucide-react";
import { AppIconGrid } from "@/components/app-icon-grid";
import { requireRole } from "@/lib/auth/server";

const GROWERS_ICONS = [
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    color: "#3b82f6",
  },
  {
    label: "Quality Control",
    href: "/quality-control-form",
    icon: ClipboardCheck,
    color: "#10b981",
  },
  {
    label: "Packout",
    href: "/packout",
    icon: PackageOpen,
    color: "#f59e0b",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    color: "#6b7280",
  },
];

export default async function GrowersDashboardPage() {
  await requireRole(["growers", "management", "admin"]);

  return (
    <div>
      <h2 className="text-2xl font-extrabold tracking-tight">Growers</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Select an app to get started.
      </p>
      <div className="mt-8">
        <AppIconGrid icons={GROWERS_ICONS} />
      </div>
    </div>
  );
}
