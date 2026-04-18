import Link from "next/link";
import { ClayCard } from "@/components/clay-card";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards/admin";
import { MemberRoleSelector } from "@/components/admin/member-role-selector";

export default async function AdminMembersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      squad: true,
      createdAt: true,
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/admin" className="text-sm text-muted-foreground hover:text-foreground">
          ← Admin
        </Link>
      </div>
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Members</h1>
        <p className="mt-1 text-muted-foreground">
          Manage roles. Admins have full access, welfare officers manage cases, users only see their own data.
        </p>
      </div>

      <ClayCard className="overflow-hidden p-0">
        <div className="divide-y divide-border">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <p className="font-semibold text-foreground">
                  {u.name || u.email || u.id}
                </p>
                <p className="text-xs text-muted-foreground">
                  {u.email} {u.squad ? `· ${u.squad}` : ""} · joined{" "}
                  {new Date(u.createdAt).toLocaleDateString()}
                </p>
              </div>
              <MemberRoleSelector userId={u.id} currentRole={u.role} />
            </div>
          ))}
        </div>
      </ClayCard>
    </div>
  );
}
