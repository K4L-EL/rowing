"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateProfileAction } from "@/app/actions/settings";

const SQUADS = ["SENIOR", "JUNIOR", "NOVICE", "MASTERS"];

export function SettingsForm({ userName, userSquad }: { userName: string; userSquad: string }) {
  const [name, setName] = useState(userName);
  const [squad, setSquad] = useState(userSquad);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await updateProfileAction({ name, squad: squad || undefined });
    setSaving(false);
    if (result.ok) {
      toast.success("Profile updated");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="clay-pressed mt-1 rounded-xl border-0 bg-clay-blue-pale"
        />
      </div>
      <div>
        <Label htmlFor="squad">Squad</Label>
        <select
          id="squad"
          value={squad}
          onChange={(e) => setSquad(e.target.value)}
          className="clay-pressed mt-1 w-full rounded-xl border-0 bg-clay-blue-pale p-2.5 text-sm"
        >
          <option value="">No squad</option>
          {SQUADS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" className="clay-button rounded-2xl" disabled={saving}>
        {saving ? <Loader2 className="size-4 animate-spin" /> : null}
        Save changes
      </Button>
    </form>
  );
}
