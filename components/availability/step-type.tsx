"use client";

import { cn } from "@/lib/utils";
import { Oar, Boat8, WaterRipple } from "@/components/icons/rowing-icons";

type Props = {
  value: "LAND" | "WATER" | null;
  onChange: (type: "LAND" | "WATER") => void;
};

export function StepType({ value, onChange }: Props) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onChange("LAND")}
        className={cn(
          "clay-sm flex flex-1 flex-col items-center gap-3 p-8 text-center transition-all",
          value === "LAND"
            ? "bg-primary text-primary-foreground"
            : "bg-card text-muted-foreground hover:bg-clay-blue-pale",
        )}
      >
        <Oar className="size-12" />
        <span className="text-lg font-bold">Land</span>
        <span className="text-sm opacity-80">
          Gym, circuits, ergo — no boats needed
        </span>
      </button>

      <button
        onClick={() => onChange("WATER")}
        className={cn(
          "clay-sm flex flex-1 flex-col items-center gap-3 p-8 text-center transition-all",
          value === "WATER"
            ? "bg-primary text-primary-foreground"
            : "bg-card text-muted-foreground hover:bg-clay-blue-pale",
        )}
      >
        <span className="flex items-center gap-1">
          <Boat8 className="size-10" />
          <WaterRipple className="size-6" />
        </span>
        <span className="text-lg font-bold">Water</span>
        <span className="text-sm opacity-80">
          On the water — select boat, seats, and blades
        </span>
      </button>
    </div>
  );
}
