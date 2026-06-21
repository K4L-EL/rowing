"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, HelpCircle, ArrowLeft, ArrowRight, Save, Send, Download } from "lucide-react";
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
import { StepType } from "./step-type";
import { nextFourteenDays, formatDay } from "@/lib/date-utils";
import { Boat1x, Boat2x, Boat4, Boat8 } from "@/components/icons/rowing-icons";

type Member = {
  id: string;
  name: string;
  squad: string | null;
  slackId: string | null;
};

const SQUADS = [
  { value: "SENIOR", label: "Senior" },
  { value: "JUNIOR", label: "Junior" },
  { value: "NOVICE", label: "Novice" },
  { value: "MASTERS", label: "Masters" },
];

const SESSION_ORDER = [
  { value: "AM1" as const, label: "AM 1", time: "06:00 — 08:00" },
  { value: "AM2" as const, label: "AM 2", time: "08:00 — 10:00" },
  { value: "NOON" as const, label: "Noon", time: "12:00 — 14:00" },
  { value: "PM1" as const, label: "PM 1", time: "14:00 — 16:00" },
  { value: "PM2" as const, label: "PM 2", time: "16:00 — 18:00" },
];

const BOATS: Record<string, string[]> = {
  "1x (single scull)": ["bow"],
  "2- (coxless pair)": ["bow", "stroke"],
  "2x (double scull)": ["bow", "stroke"],
  "4- (coxless four)": ["bow", "2", "3", "stroke"],
  "4+ (coxed four)": ["bow", "2", "3", "stroke", "cox"],
  "8+ (eight)": ["bow", "2", "3", "4", "5", "6", "7", "stroke", "cox"],
};

const BLADE_OPTIONS = [
  { value: "CROCKERS", label: "Crockers" },
  { value: "SMOOTHIE", label: "Smoothie" },
  { value: "PLAIN", label: "Plain" },
  { value: "VORTEX", label: "Vortex" },
  { value: "FAT2", label: "Fat2" },
  { value: "BIG_BLADE", label: "Big Blade" },
];

const REQUIRED_POSITIONS: Record<string, string[]> = {
  "1x (single scull)": ["bow"],
  "2- (coxless pair)": ["bow", "stroke"],
  "2x (double scull)": ["bow", "stroke"],
  "4- (coxless four)": ["bow", "2", "3", "stroke"],
  "4+ (coxed four)": ["bow", "2", "3", "stroke", "cox"],
  "8+ (eight)": ["bow", "2", "3", "4", "5", "6", "7", "stroke"],
};

const BOAT_ICONS: Record<string, typeof Boat1x> = {
  "1x (single scull)": Boat1x,
  "2- (coxless pair)": Boat2x,
  "2x (double scull)": Boat2x,
  "4- (coxless four)": Boat4,
  "4+ (coxed four)": Boat4,
  "8+ (eight)": Boat8,
};

const STEPS = ["Squad", "Date", "Session", "Type", "Build"];

type Props = {
  members: Member[];
  dayOptions: string[];
  initialDate: string;
  initialSquad: string | null;
  canSave: boolean;
  availabilityMap: Record<string, "AVAILABLE" | "UNAVAILABLE" | "MAYBE">;
  sessionParam: string | null;
};

export function CrewBuilderWizard({
  members,
  dayOptions,
  initialDate,
  initialSquad,
  canSave,
  availabilityMap,
  sessionParam,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [squad, setSquad] = useState<string>(initialSquad ?? "SENIOR");
  const [date, setDate] = useState(initialDate);
  const [session, setSession] = useState<"AM1" | "AM2" | "NOON" | "PM1" | "PM2">(
    (sessionParam as "AM1" | "AM2" | "NOON" | "PM1" | "PM2") ?? "AM1",
  );
  const [type, setType] = useState<"LAND" | "WATER" | null>(null);
  const [boatType, setBoatType] = useState("8+ (eight)");
  const [positions, setPositions] = useState<Record<string, string | null>>({});
  const [crewName, setCrewName] = useState("");
  const [note, setNote] = useState("");
  const [blades, setBlades] = useState<string[]>([]);
  const [isSaving, startSaving] = useTransition();
  const [isSharing, startSharing] = useTransition();
  const [savedCrewId, setSavedCrewId] = useState<string | null>(null);

  const squadMembers = useMemo(
    () => members.filter((m) => m.squad === squad),
    [members, squad],
  );

  const positionList = BOATS[boatType] ?? [];

  const assignedIds = useMemo(
    () => new Set(Object.values(positions).filter(Boolean) as string[]),
    [positions],
  );

  const availableMemberIds = useMemo(() => {
    return new Set(
      squadMembers
        .filter((m) => {
          const status = availabilityMap[`${m.id}:${session}`];
          return status === "AVAILABLE" || status === "MAYBE";
        })
        .map((m) => m.id),
    );
  }, [squadMembers, session, availabilityMap]);

  const availableMembers = useMemo(
    () => squadMembers.filter((m) => availableMemberIds.has(m.id)),
    [squadMembers, availableMemberIds],
  );

  function changeBoat(next: string | null) {
    if (!next) return;
    setBoatType(next);
    setPositions(Object.fromEntries((BOATS[next] ?? []).map((p) => [p, null])));
  }

  function assign(position: string, userId: string | null) {
    setPositions((p) => ({ ...p, [position]: userId }));
  }

  function toggleBlade(blade: string) {
    setBlades((prev) =>
      prev.includes(blade) ? prev.filter((b) => b !== blade) : [...prev, blade],
    );
  }

  async function handleSave() {
    if (!crewName.trim()) {
      toast.error("Give the crew a name first.");
      return;
    }

    // Duplicate seat assignment check
    const assignedList = Object.values(positions).filter(Boolean);
    const uniqueIds = new Set(assignedList);
    if (uniqueIds.size !== assignedList.length) {
      toast.error("A member can only be assigned to one seat.");
      return;
    }

    // Required seats check (only for WATER sessions)
    if (type === "WATER") {
      const required = REQUIRED_POSITIONS[boatType] ?? [];
      const emptyRequired = required.filter((pos) => !positions[pos]);
      if (emptyRequired.length > 0) {
        toast.error(
          "Please fill all required seats: " + emptyRequired.join(", "),
        );
        return;
      }
    }

    startSaving(async () => {
      const res = await saveCrewSheetAction(
        crewName,
        date,
        session,
        type ?? "LAND",
        type === "WATER" ? boatType : undefined,
        type === "WATER" ? positions : undefined,
        squad,
        blades.length > 0 ? blades : undefined,
        note,
      );
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Crew sheet saved.");
      setSavedCrewId(res.id);
    });
  }

  async function shareToSlack() {
    const members = Object.entries(positions)
      .filter(([, id]) => id)
      .map(([position, id]) => {
        const member = squadMembers.find((m) => m.id === id);
        return {
          name: member?.name ?? id,
          position,
          slackId: member?.slackId ?? null,
        };
      });

    startSharing(async () => {
      const res = await fetch("/api/slack/share-crew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: crewName,
          squad,
          date,
          session,
          type,
          boatType: type === "WATER" ? boatType : undefined,
          members,
          note: note || undefined,
        }),
      });
      if (!res.ok) {
        toast.error("Failed to post to Slack. Check your Slack token configuration.");
        return;
      }
      toast.success("Crew sheet posted to Slack.");
      setCrewName("");
      setNote("");
      setBlades([]);
      setPositions({});
      setSavedCrewId(null);
      setStep(0);
    });
  }

  function canGoNext(): boolean {
    switch (step) {
      case 0: return !!squad;
      case 1: return !!date;
      case 2: return !!session;
      case 3: return !!type;
      case 4: return true;
      default: return false;
    }
  }

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }

  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              onClick={() => i <= step && setStep(i)}
              className={cn(
                "clay-sm flex h-8 w-8 items-center justify-center text-xs font-bold transition-all",
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-clay-mint text-foreground"
                    : "bg-card text-muted-foreground",
              )}
            >
              {i < step ? <Check className="size-3.5" /> : i + 1}
            </button>
            <span
              className={cn(
                "hidden text-xs font-medium md:inline",
                i === step ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="h-px w-4 bg-border md:w-6" />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <ClayCard className="p-6">
        {/* Step 1: Squad */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Select squad</h2>
            <p className="text-sm text-muted-foreground">
              Choose which squad you&apos;re building a crew for.
            </p>
            <Select value={squad} onValueChange={(v) => v && setSquad(v)}>
              <SelectTrigger className="max-w-xs">
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
            <p className="text-sm text-muted-foreground">
              {availableMembers.length} of {squadMembers.length} members available for{" "}
              {SESSION_ORDER.find((s) => s.value === session)?.label ?? session}.
            </p>
          </div>
        )}

        {/* Step 2: Date */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Select date</h2>
            <p className="text-sm text-muted-foreground">
              Pick the day for this crew.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {dayOptions.map((d) => {
                const isSelected = d === date;
                return (
                  <button
                    key={d}
                    onClick={() => setDate(d)}
                    className={cn(
                      "clay-sm p-3 text-center text-sm font-semibold transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-clay-blue-pale",
                    )}
                  >
                    {formatDay(new Date(d))}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Session */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Select session</h2>
            <p className="text-sm text-muted-foreground">
              What time is the session?
            </p>
            <div className="grid gap-3 sm:grid-cols-5">
              {SESSION_ORDER.map((s) => {
                const isSelected = session === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => setSession(s.value as "AM1" | "AM2" | "NOON" | "PM1" | "PM2")}
                    className={cn(
                      "clay-sm flex flex-col items-center gap-1 p-4 text-center transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-clay-blue-pale",
                    )}
                  >
                    <span className="text-sm font-bold">{s.label}</span>
                    <span className="text-[10px] opacity-80">{s.time}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Type */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Session type</h2>
            <p className="text-sm text-muted-foreground">
              Is this a land or water session?
            </p>
            <StepType value={type} onChange={setType} />
          </div>
        )}

        {/* Step 5: Build */}
        {step === 4 && (
          <div className="space-y-6">
            {type === "LAND" && (
              <div>
                <h2 className="text-lg font-bold">Land session — available members</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {availableMembers.length} of {squadMembers.length} members available for{" "}
                  {SESSION_ORDER.find((s) => s.value === session)?.label ?? session}.
                  No boat selection needed.
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                  {availableMembers.map((m) => (
                    <li
                      key={m.id}
                      className="clay-sm flex items-center justify-between bg-clay-mint p-3"
                    >
                      <span className="text-sm font-semibold">{m.name}</span>
                      <Check className="size-4 text-primary" />
                    </li>
                  ))}
                </ul>
                {availableMembers.length === 0 && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No members have marked themselves available for this session.
                  </p>
                )}
              </div>
            )}

            {type === "WATER" && (
              <>
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Left: members list */}
                  <div>
                    <h2 className="text-lg font-bold">Available members</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {squad.toLowerCase()} squad &mdash; {availableMembers.length} of{" "}
                      {squadMembers.length} available
                    </p>
                    <ul className="mt-4 grid gap-2">
                      {squadMembers.map((m) => {
                        const assigned = assignedIds.has(m.id);
                        const isAvailable = availableMemberIds.has(m.id);
                        const status = availabilityMap[`${m.id}:${session}`];
                        return (
                          <li
                            key={m.id}
                            className={cn(
                              "clay-sm flex items-center justify-between p-3",
                              assigned
                                ? "bg-clay-blue-light"
                                : isAvailable
                                  ? "bg-card"
                                  : "bg-clay-blush/40 opacity-60",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">{m.name}</span>
                              {!isAvailable && (
                                <span className="text-[10px] text-muted-foreground">
                                  {status === "UNAVAILABLE" ? "Unavailable" : "No status"}
                                </span>
                              )}
                              {isAvailable && status === "MAYBE" && (
                                <span className="text-[10px] text-muted-foreground">Maybe</span>
                              )}
                            </div>
                            {assigned && (
                              <span className="text-xs text-primary">Assigned</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Right: boat builder */}
                  <div className="space-y-4">
                    <div>
                      <Label>Boat type</Label>
                      <Select value={boatType} onValueChange={changeBoat}>
                        <SelectTrigger className="mt-1">
                          <SelectValue>{boatType}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(BOATS).map((b) => {
                            const BoatIcon = BOAT_ICONS[b];
                            return (
                              <SelectItem key={b} value={b}>
                                <span className="flex items-center gap-2">
                                  {BoatIcon && <BoatIcon className="size-4 shrink-0 text-muted-foreground" />}
                                  {b}
                                </span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      {positionList.map((pos) => {
                        const memberId = positions[pos];
                        return (
                          <div
                            key={pos}
                            className="clay-sm flex items-center gap-2 bg-card/80 p-2"
                          >
                            <span className="flex w-16 shrink-0 items-baseline gap-0.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              {pos}
                              {REQUIRED_POSITIONS[boatType]?.includes(pos) && (
                                <span className="text-[10px] text-destructive">*</span>
                              )}
                            </span>
                            <Select
                              value={memberId ?? "__none__"}
                              onValueChange={(v) =>
                                assign(pos, v === "__none__" ? null : v)
                              }
                            >
                              <SelectTrigger className="flex-1 text-sm">
                                <SelectValue>
                                  {memberId
                                    ? availableMembers.find((m) => m.id === memberId)
                                        ?.name ??
                                      squadMembers.find((m) => m.id === memberId)
                                        ?.name ??
                                      "\u2014"
                                    : "\u2014 empty \u2014"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__">
                                  — empty —
                                </SelectItem>
                                {availableMembers
                                  .filter(
                                    (m) =>
                                      !assignedIds.has(m.id) ||
                                      positions[pos] === m.id,
                                  )
                                  .map((m) => (
                                    <SelectItem key={m.id} value={m.id}>
                                      <span className="flex items-center gap-2 text-sm">
                                        {m.name}
                                        {availabilityMap[`${m.id}:${session}`] ===
                                          "MAYBE" && (
                                          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                            Maybe
                                          </span>
                                        )}
                                      </span>
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      })}
                    </div>

                    {/* Blades multi-select */}
                    <div>
                      <Label>Blades</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {BLADE_OPTIONS.map((b) => {
                          const selected = blades.includes(b.value);
                          return (
                            <button
                              key={b.value}
                              onClick={() => toggleBlade(b.value)}
                              className={cn(
                                "clay-sm px-3 py-1.5 text-xs font-medium transition-all",
                                selected
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-card text-muted-foreground hover:bg-clay-blue-pale",
                              )}
                            >
                              {b.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Seat-fill progress bar */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {Object.values(positions).filter(Boolean).length} of{" "}
                        {(REQUIRED_POSITIONS[boatType] ?? positionList).length} seats filled
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${
                              ((Object.values(positions).filter(Boolean).length) /
                                ((REQUIRED_POSITIONS[boatType] ?? positionList).length || 1)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Crew name and save */}
            {canSave && !savedCrewId && (
              <div className="space-y-3 border-t border-border pt-4">
                <div className="grid gap-3 sm:grid-cols-2">
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
                </div>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="clay-button gap-2 rounded-xl"
                >
                  <Save className="size-4" />
                  {isSaving ? "Saving\u2026" : "Save crew sheet"}
                </Button>
              </div>
            )}

            {/* Share to Slack — after saving */}
            {canSave && savedCrewId && (
              <div className="space-y-3 border-t border-border pt-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Crew sheet saved. Share it on Slack?
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={shareToSlack}
                    disabled={isSharing}
                    className="clay-button gap-2 rounded-xl"
                  >
                    <Send className="size-4" />
                    {isSharing ? "Posting\u2026" : "Post to Slack"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/api/crew-sheets/${savedCrewId}/pdf`)}
                    className="clay-button gap-2 rounded-xl"
                  >
                    <Download className="size-4" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCrewName("");
                      setNote("");
                      setBlades([]);
                      setPositions({});
                      setSavedCrewId(null);
                      setStep(0);
                    }}
                    className="clay-button gap-2 rounded-xl"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
            {!canSave && (
              <p className="text-xs text-muted-foreground">
                Only coaches and admins can save crew sheets.
              </p>
            )}
          </div>
        )}
      </ClayCard>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prev}
          disabled={step === 0}
          className="clay-button gap-2 rounded-xl"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={next}
            disabled={!canGoNext()}
            className="clay-button gap-2 rounded-xl"
          >
            Next
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
