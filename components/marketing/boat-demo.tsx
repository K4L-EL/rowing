"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SEATS = ["Bow", "2", "3", "4", "5", "6", "7", "Stroke"];

const ROWER_COLORS = [
  "#0d9488",
  "#ccfbf1",
  "#a7f3d0",
  "#fde68a",
  "#fecaca",
  "#fbcfe8",
  "#f0fdfa",
  "#e7e5e4",
];

const SEAT_POSITIONS = [72, 103, 134, 165, 196, 227, 258, 289];

export function BoatDemo() {
  const [filled, setFilled] = useState<Set<number>>(new Set());
  const [rocking, setRocking] = useState(false);
  const [showRipples, setShowRipples] = useState(false);
  const [userTouched, setUserTouched] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const count = filled.size;
  const isComplete = count === 8;

  // One-shot autofill on mount: fills all 8 seats then stops
  useEffect(() => {
    let step = 0;
    const id = setInterval(() => {
      step++;
      if (step > 8) {
        clearInterval(id);
        // boat sits full, add rock + ripple after the last seat
        setTimeout(() => setRocking(true), 100);
        setTimeout(() => setShowRipples(true), 400);
        return;
      }
      const next = new Set<number>();
      for (let i = 0; i < step; i++) next.add(i);
      setFilled(next);
    }, 400);
    return () => clearInterval(id);
  }, []);

  const handleSeatClick = useCallback((index: number) => {
    setUserTouched(true);
    setFilled((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      if (next.size === 8) {
        setTimeout(() => setRocking(true), 100);
        setTimeout(() => setShowRipples(true), 400);
      } else {
        setRocking(false);
        setShowRipples(false);
      }

      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setUserTouched(true);
    setFilled(new Set());
    setRocking(false);
    setShowRipples(false);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Label */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Build Your Crew
      </p>

      {/* Counter */}
      <div className="text-center">
        <p className="text-2xl font-black text-foreground">
          {count}
          <span className="text-base font-medium text-muted-foreground">
            /8
          </span>
        </p>
        {isComplete ? (
          <p className="text-sm font-semibold text-primary animate-pulse">
            Ready to launch!
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Tap a seat to assign a rower
          </p>
        )}
      </div>

      {/* Boat container */}
      <div className="relative">
        <div
          className={cn(
            "transition-transform duration-500 ease-in-out",
            rocking && "animate-boat-rock",
          )}
        >
          <svg
            viewBox="0 0 160 380"
            className="h-72 w-auto drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ripple rings */}
            {showRipples && (
              <g className="animate-ripple origin-[80px_355px]">
                <ellipse
                  cx={80}
                  cy={355}
                  rx={50}
                  ry={12}
                  stroke="var(--color-primary)"
                  strokeWidth={1}
                  strokeOpacity={0.3}
                  fill="none"
                />
                <ellipse
                  cx={80}
                  cy={355}
                  rx={70}
                  ry={17}
                  stroke="var(--color-primary)"
                  strokeWidth={1}
                  strokeOpacity={0.2}
                  fill="none"
                />
              </g>
            )}

            {/* Hull shadow */}
            <path
              d="M82,17 C42,42 30,87 30,132 L27,282 C27,322 42,347 82,357 C122,347 137,322 137,282 L134,132 C134,87 122,42 82,17Z"
              className="fill-foreground/[0.04]"
            />

            {/* Main hull */}
            <path
              d="M80,15 C40,40 28,85 28,130 L25,280 C25,320 40,345 80,355 C120,345 135,320 135,280 L132,130 C132,85 120,40 80,15Z"
              className="fill-clay-blue-pale/70 stroke-primary/40"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Gunwale line (inner edge) */}
            <path
              d="M80,25 C50,48 38,85 38,130 L36,275 C36,310 48,332 80,342"
              className="stroke-primary/[0.07]"
              strokeWidth="1"
            />

            {/* Seat stations */}
            {SEATS.map((seat, i) => {
              const y = SEAT_POSITIONS[i];
              const isFilled = filled.has(i);
              const colorIdx = i % ROWER_COLORS.length;

              return (
                <g key={seat}>
                  {/* Oarlock dots */}
                  <circle
                    cx={y < 200 ? 18 : 20}
                    cy={y}
                    r={2}
                    className="fill-foreground/15"
                  />
                  <circle
                    cx={142 - (y < 200 ? 0 : 2)}
                    cy={y}
                    r={2}
                    className="fill-foreground/15"
                  />

                  {/* Clickable seat */}
                  <g
                    onClick={() => handleSeatClick(i)}
                    className={cn(
                      "cursor-pointer transition-opacity",
                      !isFilled && "hover:opacity-80",
                    )}
                  >
                    {/* Recess */}
                    <circle
                      cx={80}
                      cy={y}
                      r={14}
                      className="fill-white/60 stroke-foreground/10"
                      strokeWidth="1.5"
                    />
                    {isFilled ? (
                      <>
                        {/* Rower body */}
                        <circle
                          cx={80}
                          cy={y}
                          r={12}
                          fill={ROWER_COLORS[colorIdx]}
                          className="animate-seat-fill"
                        />
                        {/* Silhouette */}
                        <g className="text-foreground/50">
                          <circle
                            cx={80}
                            cy={y - 3}
                            r={3.5}
                            fill="currentColor"
                            fillOpacity={0.4}
                          />
                          <rect
                            x={77}
                            y={y + 1}
                            width={6}
                            height={6}
                            rx={1.5}
                            fill="currentColor"
                            fillOpacity={0.3}
                          />
                          <line
                            x1={74}
                            y1={y + 2}
                            x2={67}
                            y2={y - 1}
                            stroke="currentColor"
                            strokeWidth={1}
                            strokeOpacity={0.4}
                          />
                          <line
                            x1={86}
                            y1={y + 2}
                            x2={93}
                            y2={y - 1}
                            stroke="currentColor"
                            strokeWidth={1}
                            strokeOpacity={0.4}
                          />
                        </g>
                      </>
                    ) : (
                      <>
                        <text
                          x={80}
                          y={y - 1}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="fill-muted-foreground/30 text-[6px] font-medium"
                        >
                          {seat}
                        </text>
                        <text
                          x={80}
                          y={y + 9}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="fill-primary/50 text-[11px] font-bold"
                        >
                          +
                        </text>
                      </>
                    )}
                  </g>
                </g>
              );
            })}

            {/* Cox seat */}
            <circle
              cx={80}
              cy={325}
              r={9}
              className="fill-white/40 stroke-foreground/10"
              strokeWidth="1"
            />
            <text
              x={80}
              y={325}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-muted-foreground/30 text-[6px]"
            >
              Cox
            </text>

            {/* Bow / Stern labels */}
            <text
              x={80}
              y={4}
              textAnchor="middle"
              className="fill-foreground/[0.05] text-[6px] font-semibold"
            >
              BOW
            </text>
            <text
              x={80}
              y={371}
              textAnchor="middle"
              className="fill-foreground/[0.05] text-[6px] font-semibold"
            >
              STERN
            </text>
          </svg>
        </div>

        {/* Water reflection */}
        <div className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 h-5 w-36 rounded-full bg-gradient-to-t from-primary/10 to-transparent blur-md" />

        {/* Reset button — only when user has interacted and not all filled */}
        {userTouched && count > 0 && count < 8 && (
          <button
            onClick={handleReset}
            className="absolute -right-2 top-0 clay-sm rounded-full bg-card px-2 py-0.5 text-[9px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Footer */}
      {isComplete ? (
        <Link
          href="/register"
          className="clay-button inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg"
        >
          Build your crew <ArrowRight className="size-3" />
        </Link>
      ) : (
        <p className="text-[10px] text-muted-foreground text-center max-w-[180px] leading-relaxed">
          Click each seat to assign a rower and see the crew come together.
        </p>
      )}
    </div>
  );
}
