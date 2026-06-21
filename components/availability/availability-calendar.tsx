"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, X, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { ClayCard } from "@/components/clay-card";
import { setAvailabilityAction } from "@/app/actions/availability";
import { cn } from "@/lib/utils";
import { SquadAvailabilitySetter } from "./squad-availability-setter";

type Status = "AVAILABLE" | "UNAVAILABLE" | "MAYBE" | null;

const SESSION_ORDER = ["AM1", "AM2", "NOON", "PM1", "PM2"] as const;
const SESSION_LABELS: Record<string, string> = {
  AM1: "AM 1",
  AM2: "AM 2",
  NOON: "Noon",
  PM1: "PM 1",
  PM2: "PM 2",
};

const NEXT: Record<string, Status> = {
  null: "AVAILABLE",
  AVAILABLE: "MAYBE",
  MAYBE: "UNAVAILABLE",
  UNAVAILABLE: "AVAILABLE",
};

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Available",
  MAYBE: "Maybe",
  UNAVAILABLE: "Unavailable",
};

const STATUS_STYLES: Record<string, string> = {
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
  initial: Record<string, Record<string, "AVAILABLE" | "UNAVAILABLE" | "MAYBE">>;
  isAdmin: boolean;
};

export function AvailabilityCalendar({ days, initial, isAdmin }: Props) {
  const [state, setState] = useState<
    Record<string, Record<string, Status>>
  >(() => {
    const s: Record<string, Record<string, Status>> = {};
    for (const d of days) {
      s[d] = {};
      for (const sess of SESSION_ORDER) {
        s[d][sess] = (initial[d]?.[sess] as Status) ?? null;
      }
    }
    return s;
  });

  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function cycle(day: string, session: string) {
    const current = state[day]?.[session] ?? null;
    const next = NEXT[String(current)] as Status;
    if (!next) return;

    setState((s) => ({
      ...s,
      [day]: { ...s[day], [session]: next },
    }));

    startTransition(async () => {
      const res = await setAvailabilityAction(day, session as any, next);
      if (!res.ok) {
        toast.error(res.error);
        setState((s) => ({
          ...s,
          [day]: { ...s[day], [session]: current },
        }));
      }
    });
  }

  function toggleExpand(day: string) {
    setExpandedDay((prev) => (prev === day ? null : day));
  }

  function countSet(day: string): number {
    const sessions = state[day] ?? {};
    return Object.values(sessions).filter((s) => s !== null).length;
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

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((day) => {
          const d = new Date(day);
          const label = d.toLocaleDateString(undefined, {
            weekday: "short",
            day: "numeric",
            month: "short",
          });
          const parts = label.split(" ");
          const weekday = parts[0];
          const rest = parts.slice(1).join(" ");
          const set = countSet(day);
          const isExpanded = expandedDay === day;

          return (
            <div key={day} className="flex flex-col gap-1">
              <button
                onClick={() => toggleExpand(day)}
                disabled={isPending}
                className={cn(
                  "clay-sm flex flex-col items-center gap-1 p-3 text-sm font-semibold transition-all",
                  "bg-card hover:bg-clay-blue-pale",
                  isExpanded && "ring-2 ring-primary",
                )}
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {weekday}
                </span>
                <span className="text-base">{rest}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {set}/5 sessions
                  {isExpanded ? (
                    <ChevronUp className="size-3" />
                  ) : (
                    <ChevronDown className="size-3" />
                  )}
                </span>
              </button>

              {isExpanded && (
                <div className="clay-pressed flex flex-col gap-1.5 bg-card p-2">
                  {SESSION_ORDER.map((sess) => {
                    const status = state[day]?.[sess] ?? null;
                    return (
                      <button
                        key={sess}
                        onClick={() => cycle(day, sess)}
                        disabled={isPending}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all",
                          status
                            ? STATUS_STYLES[status]
                            : "bg-clay-blue-pale/50 hover:bg-clay-blue-light",
                        )}
                      >
                        <span>{SESSION_LABELS[sess]}</span>
                        <span className="flex items-center gap-1">
                          {statusIcon(status)}
                          {status ? STATUS_LABEL[status] : "Tap"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isAdmin && (
        <div className="mt-6 border-t border-border pt-6">
          <h3 className="mb-3 text-sm font-bold text-foreground">Admin — Set squad availability</h3>
          <SquadAvailabilitySetter />
        </div>
      )}
    </ClayCard>
  );
}
