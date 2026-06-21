"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AdminEventsForm() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("name"),
      date: form.get("date"),
      time: form.get("time") || "TBC",
      venue: form.get("venue"),
      description: form.get("desc"),
      price: Number(form.get("price")) || 0,
      capacity: form.get("capacity") ? Number(form.get("capacity")) : null,
      inviteOnly: form.get("invite") === "on",
    };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Event created");
      router.refresh();
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error("Failed to create event");
    } finally {
      setPending(false);
    }
  }

  return (
    <ClayCard className="p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <Plus className="size-5 text-primary" />
        Create new event
      </h2>
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Event name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Annual Dinner"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" className="mt-1" required />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              name="time"
              placeholder="e.g. 7:00 PM"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="venue">Venue</Label>
            <Input id="venue" name="venue" className="mt-1" required />
          </div>
        </div>
        <div>
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            name="desc"
            rows={3}
            className="mt-1"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="price">Ticket price (&pound;)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="capacity">Ticket limit</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              placeholder="e.g. 120"
              className="mt-1"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="invite" name="invite" />
          <Label htmlFor="invite">
            Invite-only (AGM, committee meetings, etc.)
          </Label>
        </div>
        <Button
          type="submit"
          className="clay-button rounded-xl"
          disabled={pending}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          Create event
        </Button>
      </form>
    </ClayCard>
  );
}
