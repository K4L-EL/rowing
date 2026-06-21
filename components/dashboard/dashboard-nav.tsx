"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentType } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Heart,
  Package,
  PartyPopper,
  PoundSterling,
  LogOut,
  Menu,
  X,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ClayCard } from "@/components/clay-card";
import { cn } from "@/lib/utils";
import type { AppRole } from "@/types/next-auth";
import { WaterRipple, Oar, Whistle } from "@/components/icons/rowing-icons";
import { RoleWelcomePopup } from "@/components/dashboard/role-welcome-popup";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notifications/notification-bell";

type LinkItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  roles: AppRole[];
};

const links: LinkItem[] = [
  { href: "/dashboard/welfare", label: "Welfare", icon: Heart, color: "bg-clay-blue", roles: ["MEMBER", "COACH", "WELFARE_OFFICER", "COMMITTEE", "ADMIN"] },
  { href: "/dashboard/availability", label: "Availability", icon: WaterRipple, color: "bg-clay-mint", roles: ["MEMBER", "COACH", "COMMITTEE", "ADMIN"] },
  { href: "/dashboard/crew-builder", label: "Crew builder", icon: Oar, color: "bg-clay-lavender", roles: ["COACH", "ADMIN"] },
  { href: "/dashboard/accounting", label: "Accounting", icon: PoundSterling, color: "bg-clay-sky", roles: ["COMMITTEE", "ADMIN"] },
  { href: "/dashboard/kit", label: "Kit orders", icon: Package, color: "bg-clay-lavender", roles: ["MEMBER", "COACH", "COMMITTEE", "ADMIN"] },
  { href: "/dashboard/events", label: "Events", icon: PartyPopper, color: "bg-clay-mint", roles: ["MEMBER", "COACH", "COMMITTEE", "ADMIN"] },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, color: "bg-clay-sky", roles: ["MEMBER", "COACH", "WELFARE_OFFICER", "COMMITTEE", "ADMIN"] },
  { href: "/dashboard/admin", label: "Admin", icon: Whistle, color: "bg-primary", roles: ["WELFARE_OFFICER", "COMMITTEE", "ADMIN"] },
  { href: "/dashboard/roles", label: "Roles", icon: ShieldCheck, color: "bg-clay-blue", roles: ["MEMBER", "COACH", "WELFARE_OFFICER", "COMMITTEE", "ADMIN"] },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user?.role ?? "MEMBER") as AppRole;

  const visibleLinks = links.filter((l) => l.roles.includes(userRole));

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <Link
        href="/dashboard/welfare"
        onClick={onNavigate}
        className="flex items-center gap-2 px-2 py-1"
      >
        <span className="clay-sm inline-flex size-9 items-center justify-center bg-primary text-lg font-bold text-primary-foreground">
          R
        </span>
        <span className="text-lg font-bold tracking-tight text-foreground">
          Portal
        </span>
        <span className="ml-auto rounded-full bg-clay-mint px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          {userRole === "ADMIN" ? "Admin" : userRole === "COACH" ? "Coach" : userRole === "WELFARE_OFFICER" ? "Welfare" : userRole === "COMMITTEE" ? "Committee" : "Member"}
        </span>
      </Link>

      <div className="flex items-center justify-end gap-2 pr-2">
        <NotificationBell />
      </div>

      <RoleWelcomePopup />

      <ClayCard className="flex flex-1 flex-col gap-1 p-3">
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Modules
        </p>
        <nav className="flex flex-col gap-1">
          {visibleLinks.map(({ href, label, icon: Icon, color }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
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

      <ThemeToggle />

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="clay-button flex items-center justify-center gap-2 bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <LogOut className="size-4" />
        Sign out
      </button>
    </div>
  );
}

export function DashboardNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-background/60 md:flex md:flex-col">
        <NavContent />
      </aside>

      {/* Mobile header bar + sheet */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="clay-sm inline-flex size-9 items-center justify-center bg-card">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-0 bg-background/95 p-0 backdrop-blur-md">
            <NavContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <Link href="/dashboard/welfare" className="flex items-center gap-2">
          <span className="clay-sm inline-flex size-7 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
            R
          </span>
          <span className="font-semibold text-foreground">Portal</span>
        </Link>
      </div>
    </>
  );
}
