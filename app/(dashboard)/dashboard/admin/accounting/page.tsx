import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serverHasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, FileText } from "lucide-react";
import { AdminInvoiceDialog } from "./admin-invoice-dialog";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

const STATUS_CLASSES: Record<string, string> = {
  PENDING: "bg-clay-blue-pale text-foreground",
  PAID: "bg-clay-mint text-primary",
  OVERDUE: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-muted text-muted-foreground",
};

export default async function AdminAccountingPage() {
  const session = await auth();
  if (
    !session?.user ||
    !serverHasPermission(session.user.role as any, "manage:system")
  ) {
    redirect("/login");
  }

  const invoices = await prisma.invoice.findMany({
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const users = await prisma.user.findMany({
    where: { role: { not: "ADMIN" } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true },
  });

  const overdueInvoices = invoices.filter((i) => i.status === "OVERDUE");
  const overdueCount = overdueInvoices.length;
  const allInvoices = invoices;
  const pendingInvoices = invoices.filter((i) => i.status === "PENDING");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/admin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Admin
        </Link>
      </div>
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Accounting
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage arrears, invoices and payment requests.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <ClayCard color="bluePale" className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="size-5 text-primary" />
            <h2 className="text-lg font-bold">
              Arrears ({overdueCount})
            </h2>
          </div>
          {overdueInvoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No overdue invoices. All clear!
            </p>
          ) : (
            <ul className="space-y-2">
              {overdueInvoices.map((inv) => (
                <li
                  key={inv.id}
                  className="clay-sm flex items-center justify-between bg-card/70 p-3"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {inv.user.name ?? inv.user.email ?? "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {inv.title}
                      {inv.dueDate && (
                        <>
                          {" "}
                          &middot; Due{" "}
                          {new Date(inv.dueDate).toLocaleDateString()}
                        </>
                      )}
                    </p>
                  </div>
                  <span className="font-bold text-destructive">
                    &pound;{inv.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ClayCard>

        <ClayCard className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <h2 className="text-lg font-bold">Raise a payment request</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Send invoices for one-off payments (race fees, kit orders, event
            tickets) or set up monthly direct debits for membership.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <AdminInvoiceDialog users={users} />
            <Button
              variant="outline"
              className="clay-button rounded-xl"
              disabled
            >
              <Plus className="size-4" />
              Set up monthly direct debit
            </Button>
            <p className="text-xs text-muted-foreground">
              Stripe integration coming soon.
            </p>
          </div>
        </ClayCard>
      </div>

      {allInvoices.length > 0 && (
        <ClayCard className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            All invoices
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Member</th>
                  <th className="pb-2 pr-4 font-medium">Title</th>
                  <th className="pb-2 pr-4 font-medium">Amount</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {allInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-semibold">
                      {inv.user.name ?? inv.user.email ?? "Unknown"}
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {inv.title}
                    </td>
                    <td className="py-2 pr-4 font-medium">
                      &pound;{inv.amount.toFixed(2)}
                    </td>
                    <td className="py-2 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          STATUS_CLASSES[inv.status] ??
                          "bg-muted text-foreground"
                        }`}
                      >
                        {STATUS_LABELS[inv.status] ?? inv.status}
                      </span>
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ClayCard>
      )}
    </div>
  );
}
