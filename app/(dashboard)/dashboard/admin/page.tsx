import Link from "next/link";
import { Heart, PoundSterling, Package, PartyPopper, Users } from "lucide-react";
import { ClayCard } from "@/components/clay-card";
import { requireAdmin } from "@/lib/guards/admin";

const sections = [
  {
    href: "/dashboard/admin/welfare",
    title: "Welfare cases",
    body: "View all reports, update status, and assign team members.",
    icon: Heart,
    color: "bluePale" as const,
  },
  {
    href: "/dashboard/admin/accounting",
    title: "Accounting",
    body: "Arrears, invoices and payment requests.",
    icon: PoundSterling,
    color: "mint" as const,
  },
  {
    href: "/dashboard/admin/kit",
    title: "Kit shop",
    body: "Add, edit and retire kit items.",
    icon: Package,
    color: "blueLight" as const,
  },
  {
    href: "/dashboard/admin/events",
    title: "Events",
    body: "Create events, manage ticket limits and invitations.",
    icon: PartyPopper,
    color: "lavender" as const,
  },
  {
    href: "/dashboard/admin/members",
    title: "Members",
    body: "Manage user roles and squads.",
    icon: Users,
    color: "white" as const,
  },
];

export default async function AdminHomePage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Admin</h1>
        <p className="mt-1 text-muted-foreground">
          Run the club — welfare, accounting, kit, events, and members.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="group">
            <ClayCard
              color={s.color}
              className="flex flex-col gap-3 p-6 transition-transform duration-200 group-hover:-translate-y-1"
            >
              <span className="clay-sm inline-flex size-12 items-center justify-center bg-white/70">
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
