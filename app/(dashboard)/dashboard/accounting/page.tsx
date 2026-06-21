import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ClayCard } from "@/components/clay-card";
import { Banknote, AlertCircle } from "lucide-react";

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

export default async function AccountingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const overdueCount = invoices.filter((i) => i.status === "OVERDUE").length;
  const pendingCount = invoices.filter((i) => i.status === "PENDING").length;
  const totalOutstanding = invoices
    .filter((i) => i.status === "PENDING" || i.status === "OVERDUE")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Accounting &amp; bills
        </h1>
        <p className="mt-1 text-muted-foreground">
          View your invoices and track payments.
        </p>
      </div>

      {invoices.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <ClayCard className="p-4 text-center">
            <p className="text-2xl font-black text-foreground">
              &pound;{totalOutstanding.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              Total outstanding
            </p>
          </ClayCard>
          <ClayCard color="bluePale" className="p-4 text-center">
            <p className="text-2xl font-black text-foreground">
              {pendingCount}
            </p>
            <p className="text-xs text-muted-foreground">Pending invoices</p>
          </ClayCard>
          <ClayCard
            color={overdueCount > 0 ? "blush" : "mint"}
            className="p-4 text-center"
          >
            <p className="text-2xl font-black text-foreground">
              {overdueCount}
            </p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </ClayCard>
        </div>
      )}

      <ClayCard className="flex items-center gap-3 p-4">
        <AlertCircle className="size-5 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Online payments are coming soon. For now, please contact the committee
          to settle invoices.
        </p>
      </ClayCard>

      {invoices.length === 0 ? (
        <ClayCard className="flex flex-col items-center gap-4 p-12 text-center">
          <Banknote className="size-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">No invoices yet.</p>
        </ClayCard>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <ClayCard
              key={invoice.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <p className="font-semibold text-foreground">
                  {invoice.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {invoice.description ?? (
                    <span className="italic">No description</span>
                  )}
                  {invoice.dueDate && (
                    <>
                      {" "}
                      &middot; Due{" "}
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-foreground">
                  &pound;{invoice.amount.toFixed(2)}
                </span>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                    STATUS_CLASSES[invoice.status] ?? "bg-muted text-foreground"
                  }`}
                >
                  {STATUS_LABELS[invoice.status] ?? invoice.status}
                </span>
              </div>
            </ClayCard>
          ))}
        </div>
      )}
    </div>
  );
}
