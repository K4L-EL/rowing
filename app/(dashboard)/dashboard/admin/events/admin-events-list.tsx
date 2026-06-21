"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, CalendarDays, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EventItem = {
  id: string;
  title: string;
  date: Date;
  venue: string;
  price: number;
};

export function AdminEventsList({ events: initial }: { events: EventItem[] }) {
  const [events, setEvents] = useState(initial);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete event");
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingEvent) return;
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {
      title: form.get("name"),
      date: form.get("date"),
      venue: form.get("venue"),
      description: form.get("desc"),
      price: Number(form.get("price")) || 0,
      time: (form.get("time") as string) || "TBC",
      capacity: form.get("capacity") ? Number(form.get("capacity")) : null,
    };

    try {
      const res = await fetch(`/api/events/${editingEvent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      setEvents((prev) =>
        prev.map((e) => (e.id === updated.id ? { ...e, title: updated.title, date: new Date(updated.date), venue: updated.venue, price: updated.price } : e)),
      );
      toast.success("Event updated");
      setDialogOpen(false);
      setEditingEvent(null);
      router.refresh();
    } catch {
      toast.error("Failed to update event");
    } finally {
      setSaving(false);
    }
  }

  function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  if (events.length === 0) {
    return (
      <ClayCard className="flex flex-col items-center gap-4 p-12 text-center">
        <CalendarDays className="size-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">No events created yet.</p>
      </ClayCard>
    );
  }

  return (
    <ClayCard className="p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
        Existing events
      </h2>
      <div className="space-y-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="clay-sm flex items-center justify-between bg-card/70 p-3"
          >
            <div>
              <p className="font-semibold text-sm">{event.title}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(event.date).toLocaleDateString()} &middot;{" "}
                {event.venue} &middot; &pound;{event.price}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="clay-button rounded-xl"
                onClick={() => {
                  setEditingEvent(event);
                  setDialogOpen(true);
                }}
              >
                <Pencil className="size-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="clay-button rounded-xl"
                onClick={() => handleDelete(event.id)}
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingEvent(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="edit-name">Event name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingEvent?.title ?? ""}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  name="date"
                  type="date"
                  defaultValue={editingEvent ? formatDate(new Date(editingEvent.date)) : ""}
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  name="time"
                  placeholder="e.g. 7:00 PM"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-venue">Venue</Label>
                <Input
                  id="edit-venue"
                  name="venue"
                  defaultValue={editingEvent?.venue ?? ""}
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea
                id="edit-desc"
                name="desc"
                rows={3}
                className="mt-1"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="edit-price">Ticket price (&pound;)</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={editingEvent?.price ?? ""}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-capacity">Ticket limit</Label>
                <Input
                  id="edit-capacity"
                  name="capacity"
                  type="number"
                  placeholder="e.g. 120"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                Save changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </ClayCard>
  );
}
