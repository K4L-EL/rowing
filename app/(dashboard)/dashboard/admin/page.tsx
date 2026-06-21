import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, PoundSterling, Package, PartyPopper, Users, AlertCircle, Banknote } from "lucide-react";
import { ClayCard } from "@/components/clay-card";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission, getPermissions, type Permission } from "@/lib/permissions";
import type { AppRole } from "@/types/next-auth";

const permissionLabel = (p: Permission): string => ({
  "view:own-welfare": "Your welfare reports",
  "view:all-welfare": "All welfare reports",
  "manage:welfare": "Manage welfare cases",
  "build:crews": "Build crews",
  "view:availability": "Availability",
  "view:accounting": "View accounting",
  "view:members": "Member directory",
  "manage:roles": "Manage roles",
  "manage:system": "System settings",
}[p] ?? p);

const allSections = [
  {
    href: "/dashboard/admin/welfare",
    title: "Welfare cases",
    body: "View all reports, update status, and assign team members.",
    icon: Heart,
    color: "bluePale" as const,
    permission: "manage:welfare" as const,
  },
  {
    href: "/dashboard/admin/accounting",
    title: "Accounting",
    body: "Arrears, invoices and payment requests.",
    icon: PoundSterling,
    color: "mint" as const,
    permission: "view:accounting" as const,
  },
  {
    href: "/dashboard/admin/kit",
    title: "Kit shop",
    body: "Add, edit and retire kit items.",
    icon: Package,
    color: "blueLight" as const,
    permission: "manage:system" as const,
  },
  {
    href: "/dashboard/admin/events",
    title: "Events",
    body: "Create events, manage ticket limits and invitations.",
    icon: PartyPopper,
    color: "lavender" as const,
    permission: "manage:system" as const,
  },
  {
    href: "/dashboard/admin/members",
    title: "Members",
    body: "Manage user roles and squads.",
    icon: Users,
    color: "white" as const,
    permission: "manage:roles" as const,
  },
];

type StatCard = {
  label: string;
  value: string | number;
  icon: typeof Heart;
  color: string;
  permission: Permission;
};

export default async function AdminHomePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role as AppRole;
  const sections = allSections.filter((s) => hasPermission(role, s.permission));

  // No admin access at all for this role
  if (sections.length === 0) {
    redirect("/dashboard/welfare");
  }

  const [openCases, overdueResult, upcomingEventsCount, activeItemsCount, totalMembers] =
    await Promise.all([
      prisma.welfareReport.count({ where: { status: { not: "RESOLVED" } } }),
      prisma.invoice.aggregate({ where: { status: "OVERDUE" }, _sum: { amount: true } }),
      prisma.event.count({ where: { date: { gte: new Date() } } }),
      prisma.kitItem.count({ where: { active: true } }),
      prisma.user.count(),
    ]);

  const overdueAmount = overdueResult._sum.amount ?? 0;

  const statCards: StatCard[] = [
    { label: "Open welfare cases", value: openCases, icon: Heart, color: "bg-clay-blue-light text-primary", permission: "manage:welfare" },
    { label: "Overdue invoices", value: `\u00a3${overdueAmount.toFixed(0)}`, icon: AlertCircle, color: "bg-clay-blush text-destructive", permission: "view:accounting" },
    { label: "Upcoming events", value: upcomingEventsCount, icon: PartyPopper, color: "bg-clay-lavender text-foreground", permission: "manage:system" },
    { label: "Active kit items", value: activeItemsCount, icon: Package, color: "bg-clay-blue-light text-primary", permission: "manage:system" },
    { label: "Total members", value: totalMembers, icon: Users, color: "bg-clay-mint text-primary", permission: "manage:roles" },
  ];

  const visibleStats = statCards.filter((s) => hasPermission(role, s.permission));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Admin</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your club from one place. What you see here depends on your role.
        </p>
      </div>

      {visibleStats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleStats.map((stat) => (
            <ClayCard key={stat.label} className="flex items-center gap-4 p-4">
              <span className={`clay-sm inline-flex size-10 items-center justify-center ${stat.color}`}>
                <stat.icon className="size-5" />
              </span>
              <div>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </ClayCard>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-xl bg-clay-blue-pale p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your permissions</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {getPermissions(role).map((p) => (
            <li key={p} className="rounded-full bg-card px-2.5 py-0.5 text-xs font-medium text-foreground">
              {permissionLabel(p)}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="group">
            <ClayCard
              color={s.color}
              className="flex flex-col gap-3 p-6 transition-transform duration-200 group-hover:-translate-y-1"
            >
              <span className="clay-sm inline-flex size-12 items-center justify-center bg-card/70">
                <s.icon className="size-5 text-primary" />
              </span>
              <h2 className="text-lg font-bold text-foreground">{s.title}</h2>
              <p className="text-sm leading-relaxed text-foreground/70">{s.body}</p>
            </ClayCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
