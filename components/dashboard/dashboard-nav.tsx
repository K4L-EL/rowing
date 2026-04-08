"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Heart,
  Package,
  PartyPopper,
  PoundSterling,
  LogOut,
} from "lucide-react";
import { ClayCard } from "@/components/clay-card";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard/welfare", label: "Welfare", icon: Heart, color: "bg-clay-blue" },
  { href: "/dashboard/accounting", label: "Accounting", icon: PoundSterling, color: "bg-clay-mint" },
  { href: "/dashboard/kit", label: "Kit orders", icon: Package, color: "bg-clay-sky" },
  { href: "/dashboard/events", label: "Events", icon: PartyPopper, color: "bg-clay-lavender" },
] as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col gap-4 bg-white/60 p-4 md:w-64">
      <Link
        href="/dashboard/welfare"
        className="flex items-center gap-2 px-2 py-1"
      >
        <span className="clay-sm inline-flex size-9 items-center justify-center bg-primary text-lg font-bold text-primary-foreground">
          R
        </span>
        <span className="text-lg font-bold tracking-tight text-foreground">
          Portal
        </span>
      </Link>

      <ClayCard className="flex flex-1 flex-col gap-1 p-3">
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Modules
        </p>
        <nav className="flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon, color }) => {
            const active =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "clay-sm flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-primary/10 text-primary"
                    : "bg-transparent text-muted-foreground hover:bg-clay-blue-pale hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "clay-sm inline-flex size-7 items-center justify-center",
                    active ? color : "bg-clay-blue-pale",
                  )}
                >
                  <Icon className="size-3.5" />
                </span>
                {label}
              </Link>
            );
          })}
        </nav>
      </ClayCard>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="clay-button flex items-center justify-center gap-2 bg-white px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <LogOut className="size-4" />
        Sign out
      </button>
    </aside>
  );
}
