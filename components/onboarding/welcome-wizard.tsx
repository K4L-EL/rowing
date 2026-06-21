"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, ArrowRight } from "lucide-react";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  userName?: string | null;
  existingSquad?: string | null;
};

const SQUADS = [
  { value: "SENIOR", label: "Senior" },
  { value: "JUNIOR", label: "Junior" },
  { value: "NOVICE", label: "Novice" },
  { value: "MASTERS", label: "Masters" },
];

export function WelcomeWizard({ userName, existingSquad }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [squad, setSquad] = useState(existingSquad ?? "");
  const [isPending, startTransition] = useTransition();

  const squadLabel = SQUADS.find((s) => s.value === (existingSquad ?? squad))?.label;

  async function complete() {
    startTransition(async () => {
      try {
        // Only save squad if the user newly picked it (not pre-set from registration)
        if (!existingSquad && squad) {
          const res = await fetch("/api/user/squad", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ squad }),
          });
          if (!res.ok) {
            toast.error("Failed to save squad");
            return;
          }
        }

        // Mark onboarding as complete
        const completeRes = await fetch("/api/user/onboarding", {
          method: "POST",
        });
        if (!completeRes.ok) {
          toast.error("Failed to complete onboarding");
          return;
        }

        // Refresh the JWT session cookie so middleware sees onboardingComplete = true
        await fetch("/api/auth/session");

        toast.success("Welcome to RowSafe!");
        router.replace("/dashboard/welfare");
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <ClayCard className="w-full p-8">
      {step === 0 && (
        <div className="space-y-6 text-center">
          <div className="clay-sm mx-auto inline-flex size-16 items-center justify-center bg-primary text-3xl font-black text-primary-foreground">
            R
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Welcome to RowSafe!
            </h1>
            <p className="mt-2 text-muted-foreground">
              Hi{userName ? `, ${userName}` : ""}. Let&apos;s get you set up
              in a couple of quick steps.
            </p>
          </div>
          <Button
            onClick={() => setStep(existingSquad ? 2 : 1)}
            className="clay-button gap-2 rounded-2xl px-10"
          >
            Get started <ArrowRight className="size-4" />
          </Button>
        </div>
      )}

      {step === 1 && !existingSquad && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Your squad
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Which squad are you part of?
            </p>
          </div>
          <div>
            <Label htmlFor="squad">Squad</Label>
            <Select value={squad || undefined} onValueChange={(v) => v && setSquad(v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your squad" />
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
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(0)}
              className="clay-button rounded-xl"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(2)}
              disabled={!squad}
              className="clay-button gap-2 rounded-xl"
            >
              Next <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-black tracking-tight text-foreground">
              You&apos;re all set!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {existingSquad ? (
                <>Your squad was saved during registration. Welcome aboard!</>
              ) : (
                <>
                  Your squad is set to <strong>{squadLabel}</strong>.
                  You can always change this later in your profile.
                </>
              )}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Head to the dashboard to set your availability for upcoming
              sessions.
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={complete}
              disabled={isPending}
              className="clay-button gap-2 rounded-2xl px-10"
            >
              <Check className="size-4" />
              {isPending ? "Saving…" : "Done — take me to the dashboard"}
            </Button>
          </div>
        </div>
      )}
    </ClayCard>
  );
}
