"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setSquadAvailabilityAction } from "@/app/actions/availability";
import { nextFourteenDays, toIsoDate } from "@/lib/date-utils";

const SESSIONS = [
  { value: "AM1", label: "AM 1" },
  { value: "AM2", label: "AM 2" },
  { value: "NOON", label: "Noon" },
  { value: "PM1", label: "PM 1" },
  { value: "PM2", label: "PM 2" },
];

const SQUADS = [
  { value: "SENIOR", label: "Senior" },
  { value: "JUNIOR", label: "Junior" },
  { value: "NOVICE", label: "Novice" },
  { value: "MASTERS", label: "Masters" },
];

const STATUSES = [
  { value: "AVAILABLE", label: "Available" },
  { value: "UNAVAILABLE", label: "Unavailable" },
  { value: "MAYBE", label: "Maybe" },
];

export function SquadAvailabilitySetter() {
  const [squad, setSquad] = useState("SENIOR");
  const [session, setSession] = useState("AM1");
  const [status, setStatus] = useState("AVAILABLE");
  const [date, setDate] = useState(toIsoDate(nextFourteenDays()[0]));
  const [isPending, startTransition] = useTransition();

  const dayOptions = nextFourteenDays().map(toIsoDate);

  function apply() {
    startTransition(async () => {
      const res = await setSquadAvailabilityAction(squad, date, session as any, status as any);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(`Set ${status.toLowerCase()} for ${res.count} ${squad.toLowerCase()} members`);
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <Label className="text-xs text-muted-foreground">Squad</Label>
            <Select value={squad} onValueChange={(v) => v && setSquad(v)}>
                    <SelectTrigger className="min-w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SQUADS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Date</Label>
        <Select value={date} onValueChange={(v) => v && setDate(v)}>
          <SelectTrigger className="min-w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dayOptions.map((d) => (
              <SelectItem key={d} value={d}>
                {new Date(d).toLocaleDateString(undefined, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Session</Label>
        <Select value={session} onValueChange={(v) => v && setSession(v)}>
          <SelectTrigger className="min-w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SESSIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Status</Label>
        <Select value={status} onValueChange={(v) => v && setStatus(v)}>
          <SelectTrigger className="min-w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={apply}
        disabled={isPending}
        className="clay-button gap-2 rounded-xl"
      >
        <Check className="size-4" />
        {isPending ? "Setting…" : "Apply"}
      </Button>
    </div>
  );
}
