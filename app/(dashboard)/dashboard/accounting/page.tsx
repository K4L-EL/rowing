import { ClayCard } from "@/components/clay-card";

export default function AccountingStubPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Accounting &amp; bills</h1>
      <ClayCard className="p-8">
        <p className="text-muted-foreground">
          This module is planned for a future release. You will manage invoices and payments here.
        </p>
      </ClayCard>
    </div>
  );
}
