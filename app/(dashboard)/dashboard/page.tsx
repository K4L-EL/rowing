import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { WeatherWidget } from "@/components/dashboard/weather-widget";
import { ClayCard } from "@/components/clay-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppRole } from "@/types/next-auth";

const roleCTAs: Record<
  AppRole,
  { title: string; body: string; cta: string; href: string }
> = {
  MEMBER: {
    title: "Set your availability",
    body: "Let coaches know when you can row. Update your sessions for the next fortnight.",
    cta: "Update availability",
    href: "/dashboard/availability",
  },
  COACH: {
    title: "Build your crews",
    body: "Check member availability and assign boats for the next outing.",
    cta: "Build a crew",
    href: "/dashboard/crew-builder",
  },
  WELFARE_OFFICER: {
    title: "Manage welfare cases",
    body: "View incoming reports and update case statuses across the club.",
    cta: "View cases",
    href: "/dashboard/welfare",
  },
  COMMITTEE: {
    title: "Club overview",
    body: "Accounting, member directory, and system settings at a glance.",
    cta: "View overview",
    href: "/dashboard/accounting",
  },
  ADMIN: {
    title: "System management",
    body: "Full access to all modules, roles, and settings.",
    cta: "Admin panel",
    href: "/dashboard/admin",
  },
};

export default async function DashboardHomePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const role = (session.user.role ?? "MEMBER") as AppRole;
  const cta = roleCTAs[role];

  const [reports, events, invoices, orders] = await Promise.all([
    prisma.welfareReport.findMany({
      where: { userId: session.user.id },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true, createdAt: true },
    }),
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      take: 3,
      orderBy: { date: "asc" },
      select: { id: true, title: true, date: true, venue: true },
    }),
    prisma.invoice.findMany({
      where: { userId: session.user.id },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, amount: true, status: true },
    }),
    prisma.kitOrder.findMany({
      where: { userId: session.user.id },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { item: { select: { name: true } } },
    }),
  ]);

  function serialize<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Your activity at a glance.</p>
      </div>

      {/* Role-specific CTA card */}
      <ClayCard
        color="bluePale"
        className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground">{cta.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{cta.body}</p>
        </div>
        <Link
          href={cta.href}
          className={cn(
            buttonVariants(),
            "clay-button shrink-0 gap-2 rounded-2xl",
          )}
        >
          {cta.cta} <ArrowRight className="size-4" />
        </Link>
      </ClayCard>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <ActivityFeed
            reports={serialize(reports)}
            events={serialize(events)}
            invoices={serialize(invoices)}
            orders={serialize(orders)}
          />
        </div>
        <div>
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
}
