"use client";

import { CalendarDays, MapPin, Utensils, Ticket, Clock } from "lucide-react";
import { toast } from "sonner";
import { ClayCard } from "@/components/clay-card";
import { Button } from "@/components/ui/button";

type ClubEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  price: number;
  capacity: string;
  menu?: string[];
  color: "bluePale" | "white" | "blueLight" | "mint";
};

const EVENTS: ClubEvent[] = [
  {
    id: "annual-dinner-2026",
    title: "Annual Club Dinner 2026",
    date: "Saturday 14 November 2026",
    time: "7:00 PM arrival, 7:30 PM dinner",
    venue: "The Clubhouse Boat Bay, River Road",
    description:
      "Our flagship black-tie event celebrating the season's achievements. Three-course dinner, awards, and live music.",
    price: 65,
    capacity: "120 places",
    menu: [
      "Starter: Smoked salmon with horseradish crème fraîche (v option available)",
      "Main: Slow-braised beef shin with dauphinoise potatoes (v / gf options)",
      "Dessert: Sticky toffee pudding with clotted cream",
      "Coffee and petit fours",
    ],
    color: "bluePale",
  },
  {
    id: "winter-head-regatta",
    title: "Winter Head Regatta",
    date: "Saturday 7 February 2026",
    time: "Marshalling 9:00 AM, first division 10:00 AM",
    venue: "Regatta Course, City Lake",
    description: "Club's winter head race. Crews to confirm lineup one week in advance.",
    price: 15,
    capacity: "All squads",
    color: "white",
  },
  {
    id: "spring-training-camp",
    title: "Spring Training Camp - Portugal",
    date: "6 - 13 April 2026",
    time: "Flight from Heathrow Terminal 5",
    venue: "Nautical Centre, Lagoa",
    description:
      "A week of intensive training on flat water with professional coaching support.",
    price: 620,
    capacity: "24 places (deposit required)",
    color: "blueLight",
  },
];

export function EventsList() {
  function book(name: string) {
    toast.success(`Ticket reserved for ${name} — payment coming soon.`);
  }

  return (
    <div className="space-y-5">
      {EVENTS.map((event) => (
        <ClayCard key={event.id} color={event.color} className="p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-xl font-black text-foreground md:text-2xl">
                  {event.title}
                </h2>
                <p className="mt-2 text-sm text-foreground/70">{event.description}</p>
              </div>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{event.date}</span>
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
                  <span>{event.capacity}</span>
                </div>
              </div>
              {event.menu && (
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
                <p className="text-3xl font-black text-foreground">£{event.price}</p>
              </div>
              <Button
                onClick={() => book(event.title)}
                className="clay-button w-full gap-2 rounded-xl md:w-auto"
              >
                <Ticket className="size-4" />
                Book a ticket
              </Button>
            </div>
          </div>
        </ClayCard>
      ))}
    </div>
  );
}
