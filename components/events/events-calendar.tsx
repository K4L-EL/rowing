"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ClayCard } from "@/components/clay-card";
import { cn } from "@/lib/utils";

type ClubEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  price: number;
};

type Props = {
  events: ClubEvent[];
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getMonthDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];

  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function eventsOnDay(events: ClubEvent[], year: number, month: number, day: number): ClubEvent[] {
  return events.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  });
}

export function EventsCalendar({ events }: Props) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const days = getMonthDays(year, month);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthLabel = currentMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const selectedDayEvents = selectedDate
    ? eventsOnDay(events, selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    : [];

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="clay-sm inline-flex size-9 items-center justify-center bg-white">
          <ChevronLeft className="size-4" />
        </button>
        <h3 className="text-lg font-bold text-foreground">{monthLabel}</h3>
        <button onClick={nextMonth} className="clay-sm inline-flex size-9 items-center justify-center bg-white">
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <div key={d} className="py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {d}
          </div>
        ))}

        {/* Day cells */}
        {days.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dayEvents = eventsOnDay(events, year, month, day);
          const isSelected =
            selectedDate &&
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month &&
            selectedDate.getDate() === day;
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(new Date(year, month, day))}
              className={cn(
                "flex flex-col items-center rounded-xl p-1.5 text-sm transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isToday
                    ? "bg-clay-blue-light text-foreground"
                    : "hover:bg-clay-blue-pale text-foreground",
              )}
            >
              <span className="text-xs font-medium">{day}</span>
              {dayEvents.length > 0 && (
                <span className="mt-0.5 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((_, j) => (
                    <span
                      key={j}
                      className={cn(
                        "size-1.5 rounded-full",
                        isSelected ? "bg-primary-foreground" : "bg-primary",
                      )}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day events */}
      {selectedDate && selectedDayEvents.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Events on {selectedDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          {selectedDayEvents.map((e) => (
            <ClayCard key={e.id} className="flex items-center justify-between p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.time} · {e.venue}</p>
              </div>
              <span className="text-sm font-bold text-foreground">£{e.price}</span>
            </ClayCard>
          ))}
        </div>
      )}
    </div>
  );
}
