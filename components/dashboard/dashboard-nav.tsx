"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Heart, LayoutDashboard, Package, PartyPopper, PoundSterling } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard/welfare", label: "Welfare", icon: Heart },
  { href: "/dashboard/accounting", label: "Accounting", icon: PoundSterling },
  { href: "/dashboard/kit", label: "Kit orders", icon: Package },
  { href: "/dashboard/events", label: "Events", icon: PartyPopper },
] as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col gap-4 border-r border-white/40 bg-white/25 p-4 backdrop-blur-xl md:w-64">
      <Link href="/dashboard/welfare" className="flex items-center gap-2 px-2 font-semibold text-sky-950">
        <LayoutDashboard className="size-5 text-sky-600" />
        Portal
      </Link>
      <GlassCard className="flex flex-1 flex-col gap-1 p-2">
        <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Modules</p>
        <nav className="flex flex-col gap-0.5">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sky-500/15 text-sky-900"
                    : "text-muted-foreground hover:bg-white/40 hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </GlassCard>
      <Button variant="outline" className="border-white/50 bg-white/30" onClick={() => signOut({ callbackUrl: "/" })}>
        Sign out
      </Button>
    </aside>
  );
}
