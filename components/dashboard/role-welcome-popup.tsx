"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { ClayCard } from "@/components/clay-card";

type RoleInfo = {
  title: string;
  body: string;
  links: { label: string; href: string }[];
};

const ROLE_MESSAGES: Record<string, RoleInfo> = {
  MEMBER: {
    title: "You're logged in as a Member",
    body: "You can file welfare reports, set your availability, order kit, and browse events.",
    links: [
      { label: "Set your availability", href: "/dashboard/availability" },
      { label: "Browse events", href: "/dashboard/events" },
      { label: "Order kit", href: "/dashboard/kit" },
    ],
  },
  COACH: {
    title: "You're logged in as a Coach",
    body: "You can build crews, view welfare reports, and set squad-wide availability.",
    links: [
      { label: "Build a crew", href: "/dashboard/crew-builder" },
      { label: "Set squad availability", href: "/dashboard/availability" },
      { label: "View welfare reports", href: "/dashboard/welfare" },
    ],
  },
  WELFARE_OFFICER: {
    title: "You're logged in as a Welfare Officer",
    body: "You can view and manage all welfare reports across the club.",
    links: [
      { label: "View welfare cases", href: "/dashboard/welfare" },
      { label: "Manage case statuses", href: "/dashboard/welfare" },
    ],
  },
  COMMITTEE: {
    title: "You're logged in as Committee",
    body: "You have access to accounting, the member directory, and the admin panel.",
    links: [
      { label: "View accounting", href: "/dashboard/accounting" },
      { label: "Member directory", href: "/dashboard/admin" },
    ],
  },
  ADMIN: {
    title: "You're logged in as an Admin",
    body: "You have full access to everything: welfare, accounting, kit, events, roles, and system settings.",
    links: [
      { label: "Manage roles", href: "/dashboard/roles" },
      { label: "System settings", href: "/dashboard/settings" },
      { label: "Members panel", href: "/dashboard/admin" },
    ],
  },
};

export function RoleWelcomePopup() {
  const { data: session } = useSession();
  const [dismissed, setDismissed] = useState(false);

  const role = (session?.user?.role ?? "MEMBER") as string;
  const info = ROLE_MESSAGES[role] ?? ROLE_MESSAGES.MEMBER;
  const isOnboarded = session?.user?.onboardingComplete;

  if (dismissed || !isOnboarded) return null;

  return (
    <ClayCard color="bluePale" className="relative p-4">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </button>
      <p className="text-sm font-bold text-foreground">{info.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{info.body}</p>
      {info.links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {info.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="clay-sm inline-flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
            >
              {link.label} <ArrowRight className="size-3" />
            </Link>
          ))}
        </div>
      )}
    </ClayCard>
  );
}
