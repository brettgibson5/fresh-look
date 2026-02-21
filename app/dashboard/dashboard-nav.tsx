"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  canAccessRoleDashboard,
  ROLE_DASHBOARD_PATHS,
  ROLE_LABELS,
  USER_ROLES,
  type UserRole,
} from "@/lib/auth/roles";

type DashboardNavProps = {
  currentRole: UserRole;
};

export function DashboardNav({ currentRole }: DashboardNavProps) {
  const pathname = usePathname();

  const visibleRoles = USER_ROLES.filter((role) =>
    canAccessRoleDashboard(currentRole, role),
  );

  return (
    <nav className="space-y-2">
      {visibleRoles.map((role) => {
        const href = ROLE_DASHBOARD_PATHS[role];
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Button
            key={role}
            asChild
            variant={isActive ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Link href={href} prefetch>
              {ROLE_LABELS[role]}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
