"use client";

import { Heart, PartyPopper, Banknote, Clock } from "lucide-react";
import Link from "next/link";

type Notification = {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  link?: string | null;
  createdAt: string;
};

const TYPE_ICONS: Record<string, typeof Heart> = {
  welfare_status: Heart,
  booking_confirmed: PartyPopper,
  invoice_issued: Banknote,
};

export function NotificationDropdown({ notifications, onClose }: { notifications: Notification[]; onClose: () => void }) {
  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No new notifications
      </div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      {notifications.map((n) => {
        const Icon = TYPE_ICONS[n.type] ?? Heart;
        return (
          <Link
            key={n.id}
            href={n.link ?? "#"}
            onClick={onClose}
            className="flex items-start gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-clay-blue-pale last:border-0"
          >
            <span className="clay-sm mt-0.5 inline-flex size-8 shrink-0 items-center justify-center bg-white">
              <Icon className="size-4 text-primary" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{n.title}</p>
              {n.body && <p className="text-xs text-muted-foreground">{n.body}</p>}
              <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="size-3" />
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
