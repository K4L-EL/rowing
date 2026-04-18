"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, HelpCircle, X, Users } from "lucide-react";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveCrewSheetAction } from "@/app/actions/availability";
import { cn } from "@/lib/utils";

type Status = "AVAILABLE" | "UNAVAILABLE" | "MAYBE" | null;

type Member = {
  id: string;
  name: string;
  squad: string | null;
  status: Status;
};

const BOATS: Record<string, string[]> = {
  "1x (single scull)": ["bow"],
  "2- (coxless pair)": ["bow", "stroke"],
  "2x (double scull)": ["bow", "stroke"],
  "4- (coxless four)": ["bow", "2", "3", "stroke"],
  "4+ (coxed four)": ["bow", "2", "3", "stroke", "cox"],
  "8+ (eight)": ["bow", "2", "3", "4", "5", "6", "7", "stroke", "cox"],
};

function statusIcon(s: Status) {
  if (s === "AVAILABLE") return <Check className="size-3" />;
  if (s === "UNAVAILABLE") return <X className="size-3" />;
  if (s === "MAYBE") return <HelpCircle className="size-3" />;
  return null;
}

function statusStyle(s: Status) {
  if (s === "AVAILABLE") return "bg-clay-mint";
  if (s === "UNAVAILABLE") return "bg-clay-blush opacity-60";
  if (s === "MAYBE") return "bg-clay-blue-light";
  return "bg-white";
}

type Props = {
  members: Member[];
  selectedDate: string;
  dayOptions: string[];
  canSave: boolean;
};

export function CrewBuilder({ members, selectedDate, dayOptions, canSave }: Props) {
  const router = useRouter();
  const [boatType, setBoatType] = useState<string>("8+ (eight)");
  const [positions, setPositions] = useState<Record<string, string | null>>(
    () => Object.fromEntries(BOATS["8+ (eight)"].map((p) => [p, null])),
  );
  const [crewName, setCrewName] = useState("");
  const [note, setNote] = useState("");
  const [isSaving, startSaving] = useTransition();

  const positionList = BOATS[boatType];

  const assignedIds = useMemo(
    () => new Set(Object.values(positions).filter(Boolean) as string[]),
    [positions],
  );

  function changeBoat(next: string | null) {
    if (!next) return;
    setBoatType(next);
    setPositions(Object.fromEntries(BOATS[next].map((p) => [p, null])));
  }

  function assign(position: string, userId: string | null) {
    setPositions((p) => ({ ...p, [position]: userId }));
  }

  function save() {
    if (!crewName.trim()) {
      toast.error("Give the crew a name first.");
      return;
    }
    startSaving(async () => {
      const res = await saveCrewSheetAction(crewName, selectedDate, boatType, positions, note);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Crew sheet saved.");
      setCrewName("");
      setNote("");
    });
  }

  function changeDate(next: string | null) {
    if (!next) return;
    router.push(`/dashboard/crew-builder?date=${next}`);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      {/* Members list */}
      <ClayCard className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Users className="size-5 text-primary" />
            Members ({members.length})
          </h2>
          <div>
            <Label className="text-xs text-muted-foreground">Date</Label>
            <Select value={selectedDate} onValueChange={changeDate}>
              <SelectTrigger className="min-w-[180px]">
                <SelectValue>
                  {new Date(selectedDate).toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </SelectValue>
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
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {members.map((m) => {
            const assigned = assignedIds.has(m.id);
            return (
              <li
                key={m.id}
                className={cn(
                  "clay-sm flex items-center justify-between gap-2 p-3",
                  statusStyle(m.status),
                  assigned && "ring-2 ring-primary",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{m.name}</p>
                  <p className="truncate text-xs text-foreground/60">
                    {m.squad ?? "No squad"}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
                  {statusIcon(m.status)}
                </span>
              </li>
            );
          })}
        </ul>
        {members.length === 0 && (
          <p className="text-sm text-muted-foreground">No members yet.</p>
        )}
      </ClayCard>

      {/* Boat builder */}
      <ClayCard color="bluePale" className="p-5">
        <h2 className="text-lg font-bold">Boat sheet</h2>
        <div className="mt-3 space-y-3">
          <div>
            <Label>Boat type</Label>
            <Select value={boatType} onValueChange={changeBoat}>
              <SelectTrigger className="mt-1">
                <SelectValue>{boatType}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.keys(BOATS).map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {positionList.map((pos) => {
              const memberId = positions[pos];
              return (
                <div key={pos} className="clay-sm flex items-center gap-2 bg-white/80 p-2">
                  <span className="w-16 shrink-0 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {pos}
                  </span>
                  <Select
                    value={memberId ?? "__none__"}
                    onValueChange={(v) => assign(pos, v === "__none__" ? null : v)}
                  >
                    <SelectTrigger className="flex-1 text-sm">
                      <SelectValue>
                        {memberId
                          ? members.find((m) => m.id === memberId)?.name ?? "—"
                          : "— empty —"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">— empty —</SelectItem>
                      {members.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name} {m.status ? `(${m.status.toLowerCase()})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>

          {canSave && (
            <>
              <div>
                <Label htmlFor="crewName">Crew name</Label>
                <Input
                  id="crewName"
                  value={crewName}
                  onChange={(e) => setCrewName(e.target.value)}
                  placeholder="e.g. Senior 1 VIII"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="crewNote">Notes (optional)</Label>
                <Input
                  id="crewNote"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={save} disabled={isSaving} className="clay-button w-full rounded-xl">
                {isSaving ? "Saving…" : "Save crew sheet"}
              </Button>
            </>
          )}
          {!canSave && (
            <p className="text-xs text-muted-foreground">
              Only coaches and admins can save crew sheets.
            </p>
          )}
        </div>
      </ClayCard>
    </div>
  );
}
