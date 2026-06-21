import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPermissions, type Permission } from "@/lib/permissions";
import type { AppRole } from "@/types/next-auth";

const ROLES: AppRole[] = ["MEMBER", "COACH", "WELFARE_OFFICER", "COMMITTEE", "ADMIN"];

const ROLE_LABELS: Record<AppRole, string> = {
  MEMBER: "Member",
  COACH: "Coach",
  WELFARE_OFFICER: "Welfare Officer",
  COMMITTEE: "Committee",
  ADMIN: "Admin",
};

const PERMISSION_LABELS: Record<Permission, string> = {
  "view:own-welfare": "File and view own welfare reports",
  "view:all-welfare": "View all welfare reports",
  "manage:welfare": "Manage welfare cases (status, assignment)",
  "build:crews": "Build and save crews",
  "view:availability": "Set own availability",
  "view:accounting": "View accounting and invoices",
  "view:members": "View member directory",
  "manage:roles": "Manage member roles",
  "manage:system": "System settings and admin panels",
};

const ALL_PERMISSIONS = Object.keys(PERMISSION_LABELS) as Permission[];

export default async function RolesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Role capabilities</h1>
        <p className="mt-1 text-muted-foreground">
          What each role can access in RowSafe.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-4 font-semibold text-foreground">Capability</th>
              {ROLES.map((role) => (
                <th key={role} className="p-4 text-center font-semibold text-foreground">
                  {ROLE_LABELS[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_PERMISSIONS.map((permission) => (
              <tr key={permission} className="border-b border-border last:border-0">
                <td className="p-4 text-foreground">
                  {PERMISSION_LABELS[permission]}
                </td>
                {ROLES.map((role) => {
                  const rolePermissions = new Set(getPermissions(role));
                  const has = rolePermissions.has(permission);
                  return (
                    <td key={role} className="p-4 text-center">
                      <span
                        className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                          has
                            ? "bg-clay-mint text-primary"
                            : "bg-clay-blue-pale text-muted-foreground"
                        }`}
                      >
                        {has ? "Y" : "N"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
