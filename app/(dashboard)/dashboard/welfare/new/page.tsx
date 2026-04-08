import Link from "next/link";
import { WelfareWizard } from "@/components/welfare/welfare-wizard";
import { buttonVariants } from "@/components/ui/button";

export default function NewWelfareReportPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/welfare" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          ← Back
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-sky-950">Welfare report</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Work through each section at your own pace. You can keep a copy by email after submission.
        </p>
      </div>
      <WelfareWizard />
    </div>
  );
}
