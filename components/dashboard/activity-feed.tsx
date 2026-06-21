"use client";

import { Heart, PartyPopper, Banknote, Package } from "lucide-react";
import Link from "next/link";
import { ClayCard } from "@/components/clay-card";

type Report = {
  id: string;
  status: string;
  createdAt: Date;
};

type Event = {
  id: string;
  title: string;
  date: Date;
  venue: string;
};

type Invoice = {
  id: string;
  title: string;
  amount: number;
  status: string;
};

type Order = {
  id: string;
  createdAt: Date;
  status: string;
  item: { name: string };
};

type Props = {
  reports?: Report[];
  events?: Event[];
  invoices?: Invoice[];
  orders?: Order[];
};

export function ActivityFeed({ reports = [], events = [], invoices = [], orders = [] }: Props) {
  const hasAny = reports.length > 0 || events.length > 0 || invoices.length > 0 || orders.length > 0;

  if (!hasAny) {
    return (
      <ClayCard className="flex flex-col items-center gap-4 p-12 text-center">
        <Heart className="size-12 text-muted-foreground/40" />
        <h2 className="text-xl font-bold text-foreground">Welcome to RowSafe</h2>
        <p className="text-sm text-muted-foreground">
          Get started by exploring the modules in the sidebar.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/welfare/new"
            className="clay-button rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            File a welfare report
          </Link>
          <Link
            href="/dashboard/events"
            className="clay-button rounded-2xl bg-white px-4 py-2 text-sm font-medium text-foreground"
          >
            Browse events
          </Link>
        </div>
      </ClayCard>
    );
  }

  return (
    <div className="space-y-6">
      {reports.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Heart className="size-4" />
            Recent welfare reports
          </h3>
          <div className="space-y-2">
            {reports.map((r) => (
              <Link key={r.id} href={`/dashboard/welfare/${r.id}`}>
                <ClayCard className="flex items-center justify-between p-3 transition-shadow hover:shadow-lg">
                  <span className="text-sm font-medium text-foreground">Case {r.id.slice(0, 8)}...</span>
                  <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                </ClayCard>
              </Link>
            ))}
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <PartyPopper className="size-4" />
            Upcoming events
          </h3>
          <div className="space-y-2">
            {events.map((e) => (
              <Link key={e.id} href="/dashboard/events">
                <ClayCard className="flex items-center justify-between p-3 transition-shadow hover:shadow-lg">
                  <span className="text-sm font-medium text-foreground">{e.title}</span>
                  <span className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString()}</span>
                </ClayCard>
              </Link>
            ))}
          </div>
        </section>
      )}

      {invoices.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Banknote className="size-4" />
            Recent invoices
          </h3>
          <div className="space-y-2">
            {invoices.map((inv) => (
              <Link key={inv.id} href="/dashboard/accounting">
                <ClayCard className="flex items-center justify-between p-3 transition-shadow hover:shadow-lg">
                  <span className="text-sm font-medium text-foreground">{inv.title}</span>
                  <span className="text-xs text-muted-foreground">{"\u00a3"}{inv.amount.toFixed(2)}</span>
                </ClayCard>
              </Link>
            ))}
          </div>
        </section>
      )}

      {orders.length > 0 && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Package className="size-4" />
            Recent orders
          </h3>
          <div className="space-y-2">
            {orders.map((o) => (
              <Link key={o.id} href="/dashboard/kit/orders">
                <ClayCard className="flex items-center justify-between p-3 transition-shadow hover:shadow-lg">
                  <span className="text-sm font-medium text-foreground">{o.item.name}</span>
                  <span className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</span>
                </ClayCard>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
