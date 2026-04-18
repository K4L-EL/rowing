import Link from "next/link";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/guards/admin";
import { AlertCircle, FileText, Plus } from "lucide-react";

const MOCK_ARREARS = [
  { member: "Alex Turner", amount: 45, type: "Monthly membership", due: "3 weeks overdue" },
  { member: "Priya Khan", amount: 120, type: "Regatta fee - Winter Head", due: "2 weeks overdue" },
  { member: "Chris Baker", amount: 45, type: "Monthly membership", due: "1 week overdue" },
];

export default async function AdminAccountingPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/admin" className="text-sm text-muted-foreground hover:text-foreground">
          ← Admin
        </Link>
      </div>
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Accounting</h1>
        <p className="mt-1 text-muted-foreground">Manage arrears, invoices and payment requests.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <ClayCard color="bluePale" className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="size-5 text-primary" />
            <h2 className="text-lg font-bold">Arrears ({MOCK_ARREARS.length})</h2>
          </div>
          <ul className="space-y-2">
            {MOCK_ARREARS.map((a) => (
              <li key={a.member} className="clay-sm flex items-center justify-between bg-white/70 p-3">
                <div>
                  <p className="font-semibold text-sm">{a.member}</p>
                  <p className="text-xs text-muted-foreground">{a.type} · {a.due}</p>
                </div>
                <span className="font-bold text-destructive">£{a.amount}</span>
              </li>
            ))}
          </ul>
        </ClayCard>

        <ClayCard className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <h2 className="text-lg font-bold">Raise a payment request</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Send invoices for one-off payments (race fees, kit orders, event tickets)
            or set up monthly direct debits for membership.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Button className="clay-button rounded-xl" disabled>
              <Plus className="size-4" />
              New one-off invoice
            </Button>
            <Button variant="outline" className="clay-button rounded-xl" disabled>
              <Plus className="size-4" />
              Set up monthly direct debit
            </Button>
            <p className="text-xs text-muted-foreground">
              Stripe integration coming soon.
            </p>
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
