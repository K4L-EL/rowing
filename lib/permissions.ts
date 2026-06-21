import type { AppRole } from "@/types/next-auth";

export type Permission =
  | "view:own-welfare"
  | "view:all-welfare"
  | "manage:welfare"
  | "build:crews"
  | "view:availability"
  | "view:accounting"
  | "view:members"
  | "manage:roles"
  | "manage:system";

const PERMISSION_MAP: Record<AppRole, Permission[]> = {
  MEMBER: ["view:own-welfare", "view:availability"],
  COACH: ["view:own-welfare", "view:availability", "build:crews", "view:all-welfare"],
  WELFARE_OFFICER: ["view:own-welfare", "view:all-welfare", "manage:welfare"],
  COMMITTEE: ["view:own-welfare", "view:availability", "view:accounting", "view:members"],
  ADMIN: [
    "view:own-welfare",
    "view:all-welfare",
    "manage:welfare",
    "build:crews",
    "view:availability",
    "view:accounting",
    "view:members",
    "manage:roles",
    "manage:system",
  ],
};

export function hasPermission(role: AppRole, permission: Permission): boolean {
  return PERMISSION_MAP[role]?.includes(permission) ?? false;
}

export function serverHasPermission(role: AppRole, permission: Permission): boolean {
  return (PERMISSION_MAP[role] ?? []).includes(permission);
}

export function getPermissions(role: AppRole): Permission[] {
  return PERMISSION_MAP[role] ?? [];
}
