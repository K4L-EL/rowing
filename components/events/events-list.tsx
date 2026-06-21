"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Utensils,
  Ticket,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";
import { EventsCalendar } from "@/components/events/events-calendar";

type ClubEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  price: number;
  capacity: number | null;
  menu?: string[] | null;
};

const EVENT_COLORS = [
  "bluePale",
  "white",
  "blueLight",
  "mint",
] as const;

export function EventsList() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"list" | "calendar">("list");

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => toast.error("Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  // Restore booking state from server on mount
  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((ids: string[]) => setBookedIds(new Set(ids)))
      .catch(() => { /* non-critical */ });
  }, []);

  async function handleBooking(eventId: string, title: string) {
    if (bookedIds.has(eventId)) {
      // Cancel booking
      try {
        const res = await fetch(`/api/events/${eventId}/book`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed");
        setBookedIds((prev) => {
          const next = new Set(prev);
          next.delete(eventId);
          return next;
        });
        toast.success(`Booking cancelled for ${title}`);
      } catch {
        toast.error("Could not cancel booking");
      }
    } else {
      // Book ticket
      try {
        const res = await fetch(`/api/events/${eventId}/book`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Failed");
        setBookedIds((prev) => new Set(prev).add(eventId));
        toast.success(`Booked for ${title}`);
      } catch {
        toast.error("Could not book ticket");
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <CalendarDays className="size-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">No upcoming events.</p>
      </div>
    );
  }

  return (
    <>
      {/* Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView("list")}
          className={`clay-sm px-3 py-1.5 text-xs font-semibold ${view === "list" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
        >
          List
        </button>
        <button
          onClick={() => setView("calendar")}
          className={`clay-sm px-3 py-1.5 text-xs font-semibold ${view === "calendar" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
        >
          Calendar
        </button>
      </div>

      {view === "calendar" ? (
        <EventsCalendar events={events} />
      ) : (
        <div className="space-y-5">
          {events.map((event, i) => {
        const isBooked = bookedIds.has(event.id);
        const color = EVENT_COLORS[i % EVENT_COLORS.length];

        return (
          <ClayCard
            key={event.id}
            color={color}
            className="p-6 md:p-8"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-xl font-black text-foreground md:text-2xl">
                    {event.title}
                  </h2>
                  <p className="mt-2 text-sm text-foreground/70">
                    {event.description}
                  </p>
                </div>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{new Date(event.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <Ticket className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{event.capacity ? `${event.capacity} places` : "Open to all"}</span>
                  </div>
                </div>
                {event.menu && event.menu.length > 0 && (
                  <div className="clay-sm mt-3 bg-white/60 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                      <Utensils className="size-4 text-primary" />
                      Menu
                    </div>
                    <ul className="space-y-1 text-sm text-foreground/80">
                      {event.menu.map((item) => (
                        <li key={item}>&bull; {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-3 md:min-w-[180px]">
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Ticket price
                  </p>
                  <p className="text-3xl font-black text-foreground">
                    £{event.price}
                  </p>
                </div>
                <Button
                  onClick={() => handleBooking(event.id, event.title)}
                  className={`clay-button w-full gap-2 rounded-xl md:w-auto ${
                    isBooked ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
                  }`}
                >
                  {isBooked ? (
                    <>
                      <XCircle className="size-4" />
                      Cancel booking
                    </>
                  ) : (
                    <>
                      <Ticket className="size-4" />
                      Book a ticket
                    </>
                  )}
                </Button>
              </div>
            </div>
          </ClayCard>
        );
      })}
    </div>
      )}
    </>
  );
}
