"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { reportStatusLabel } from "@/lib/welfare-status";
import { updateReportStatusAction, assignReportAction } from "@/app/actions/admin";
import type { ReportStatus } from "@prisma/client";

const STATUSES: ReportStatus[] = [
  "SUBMITTED",
  "REVIEWED",
  "ASSIGNED",
  "UNDER_DISCUSSION",
  "RESOLVED",
];

type Props = {
  reportId: string;
  currentStatus: ReportStatus;
  currentNotes: string;
};

export function AdminWelfareControls({ reportId, currentStatus, currentNotes }: Props) {
  const [status, setStatus] = useState<ReportStatus>(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const statusResult =
        status !== currentStatus
          ? await updateReportStatusAction(reportId, status, notes)
          : { ok: true as const };
      const assignResult =
        notes !== currentNotes
          ? await assignReportAction(reportId, null, notes)
          : { ok: true as const };

      if (!statusResult.ok) {
        toast.error("statusResult" in statusResult && !statusResult.ok ? "Status update failed" : "Update failed");
        return;
      }
      if (!assignResult.ok) {
        toast.error("Notes update failed");
        return;
      }
      toast.success("Saved.");
    });
  }

  return (
    <div className="mt-4 grid gap-3 border-t border-border pt-4 md:grid-cols-[auto_1fr_auto] md:items-end">
      <div>
        <Label className="text-xs text-muted-foreground">Status</Label>
        <Select value={status} onValueChange={(v) => setStatus(v as ReportStatus)}>
          <SelectTrigger className="mt-1 min-w-[180px]">
            <SelectValue>{reportStatusLabel(status)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {reportStatusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Assignee / admin notes</Label>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Assigned to Sarah M. — follow up Monday"
          className="mt-1"
        />
      </div>
      <Button onClick={save} disabled={isPending} className="clay-button rounded-xl">
        {isPending ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
