export const USER_ROLES = [
  "growers",
  "quality_control",
  "management",
  "sanitation",
  "admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  growers: "Growers",
  quality_control: "Quality Control",
  management: "Management",
  sanitation: "Sanitation",
  admin: "Admin",
};

export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
  growers: "/dashboard/growers",
  quality_control: "/dashboard/quality-control",
  management: "/dashboard/management",
  sanitation: "/dashboard/sanitation",
  admin: "/dashboard/admin",
};

export function isUserRole(value: string): value is UserRole {
  return USER_ROLES.includes(value as UserRole);
}

export function canAccessRoleDashboard(
  currentRole: UserRole,
  targetRole: UserRole,
): boolean {
  if (currentRole === "admin") {
    return true;
  }

  if (currentRole === "management") {
    return targetRole !== "admin";
  }

  return currentRole === targetRole;
}
