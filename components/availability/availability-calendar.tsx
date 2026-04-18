"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, X, HelpCircle } from "lucide-react";
import { ClayCard } from "@/components/clay-card";
import { setAvailabilityAction } from "@/app/actions/availability";
import { cn } from "@/lib/utils";

type Status = "AVAILABLE" | "UNAVAILABLE" | "MAYBE" | null;

const NEXT: Record<string, Status> = {
  null: "AVAILABLE",
  AVAILABLE: "MAYBE",
  MAYBE: "UNAVAILABLE",
  UNAVAILABLE: "AVAILABLE",
};

const LABEL: Record<string, string> = {
  AVAILABLE: "Available",
  MAYBE: "Maybe",
  UNAVAILABLE: "Unavailable",
};

const STYLES: Record<string, string> = {
  AVAILABLE: "bg-clay-mint text-foreground",
  MAYBE: "bg-clay-blue-light text-foreground",
  UNAVAILABLE: "bg-clay-blush text-foreground",
};

function statusIcon(s: Status) {
  if (s === "AVAILABLE") return <Check className="size-4" />;
  if (s === "UNAVAILABLE") return <X className="size-4" />;
  if (s === "MAYBE") return <HelpCircle className="size-4" />;
  return null;
}

type Props = {
  days: string[];
  initial: Record<string, "AVAILABLE" | "UNAVAILABLE" | "MAYBE">;
};

export function AvailabilityCalendar({ days, initial }: Props) {
  const [state, setState] = useState<Record<string, Status>>(
    Object.fromEntries(days.map((d) => [d, (initial[d] as Status) ?? null])),
  );
  const [isPending, startTransition] = useTransition();

  function cycle(day: string) {
    const current = state[day] ?? null;
    const next = NEXT[String(current)] as Status;
    if (!next) return;
    setState((s) => ({ ...s, [day]: next }));
    startTransition(async () => {
      const res = await setAvailabilityAction(day, next);
      if (!res.ok) {
        toast.error(res.error);
        setState((s) => ({ ...s, [day]: current }));
      }
    });
  }

  return (
    <ClayCard className="p-5">
      <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="clay-sm inline-flex size-5 items-center justify-center bg-clay-mint">
            <Check className="size-3" />
          </span>
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="clay-sm inline-flex size-5 items-center justify-center bg-clay-blue-light">
            <HelpCircle className="size-3" />
          </span>
          Maybe
        </span>
        <span className="flex items-center gap-1.5">
          <span className="clay-sm inline-flex size-5 items-center justify-center bg-clay-blush">
            <X className="size-3" />
          </span>
          Unavailable
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((day) => {
          const d = new Date(day);
          const label = d.toLocaleDateString(undefined, {
            weekday: "short",
            day: "numeric",
            month: "short",
          });
          const status = state[day] ?? null;
          return (
            <button
              key={day}
              onClick={() => cycle(day)}
              disabled={isPending}
              className={cn(
                "clay-sm flex flex-col items-center gap-1 p-3 text-sm font-semibold transition-all",
                status ? STYLES[status] : "bg-white hover:bg-clay-blue-pale",
              )}
            >
              <span className="text-xs font-medium text-muted-foreground">
                {label.split(" ")[0]}
              </span>
              <span className="text-base">
                {label.split(" ").slice(1).join(" ")}
              </span>
              <span className="flex items-center gap-1 text-xs">
                {statusIcon(status)}
                {status ? LABEL[status] : "Tap to set"}
              </span>
            </button>
          );
        })}
      </div>
    </ClayCard>
  );
}
