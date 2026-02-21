export const USER_ROLES = [
  "growers",
  "packing_employee",
  "management",
  "sanitation",
  "admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  growers: "Growers",
  packing_employee: "Packing Employee",
  management: "Management",
  sanitation: "Sanitation",
  admin: "Admin",
};

export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
  growers: "/growers",
  packing_employee: "/packing-employee",
  management: "/growers",
  sanitation: "/sanitation",
  admin: "/admin/users",
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
