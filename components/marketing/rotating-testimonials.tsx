"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ClayCard } from "@/components/clay-card";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  color: "bluePale" | "white" | "blueLight";
  initials: string;
};

type Props = {
  testimonials: Testimonial[];
};

export function RotatingTestimonials({ testimonials }: Props) {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const current = testimonials[active];
  if (!current) return null;

  return (
    <div className="space-y-6">
      {/* Featured testimonial — large and full-width */}
      <ClayCard
        color={current.color}
        className="flex flex-col gap-5 p-8 md:flex-row md:items-start md:p-10"
      >
        <span className="clay-sm inline-flex size-14 shrink-0 items-center justify-center bg-primary text-xl font-bold text-primary-foreground">
          {current.initials}
        </span>
        <div className="flex-1">
          <p className="text-lg leading-relaxed text-foreground/80 italic md:text-xl">
            &ldquo;{current.quote}&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div>
              <p className="font-bold text-foreground">{current.name}</p>
              <p className="text-sm text-muted-foreground">{current.role}</p>
            </div>
          </div>
        </div>
      </ClayCard>

      {/* Thumbnails row */}
      <div className="flex gap-3">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setActive(i)}
            className={cn(
              "clay-sm flex flex-1 items-center gap-2 p-3 text-left transition-all",
              i === active
                ? "bg-primary text-primary-foreground"
                : "bg-white text-muted-foreground hover:bg-clay-blue-pale",
            )}
          >
            <span
              className={cn(
                "clay-sm inline-flex size-8 shrink-0 items-center justify-center text-xs font-bold",
                i === active
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-clay-blue-pale text-foreground",
              )}
            >
              {t.initials}
            </span>
            <div className="hidden min-w-0 md:block">
              <p className="truncate text-xs font-semibold">{t.name}</p>
              <p className="truncate text-[10px] opacity-70">{t.role}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
