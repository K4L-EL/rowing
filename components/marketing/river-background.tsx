"use client";

import { motion } from "motion/react";

const WAVES = [
  { y: 80, width: 60 },
  { y: 200, width: 90 },
  { y: 320, width: 120 },
  { y: 440, width: 150 },
  { y: 560, width: 180 },
  { y: 680, width: 210 },
];

function wavePath(y: number, width: number): string {
  const cx = 200;
  const left = cx - width / 2;
  const amp = Math.max(4, width * 0.04);
  const cycles = 3;
  const segW = width / (cycles * 2);
  let d = `M${left},${y}`;
  for (let i = 0; i < cycles * 2; i++) {
    const peak = i % 2 === 0 ? -amp : amp;
    const cp1x = left + i * segW + segW * 0.3;
    const cp1y = y + peak;
    const cp2x = left + i * segW + segW * 0.7;
    const cp2y = y - peak;
    const endX = left + (i + 1) * segW;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${y}`;
  }
  return d;
}

export function RiverBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute right-0 top-0 h-full w-[55%] opacity-[0.12] dark:opacity-[0.08]">
        <svg
          viewBox="0 0 400 800"
          className="h-full w-full"
          preserveAspectRatio="xMaxYMin slice"
          fill="none"
        >
          <defs>
            <linearGradient id="riverDeep" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0d9488" stopOpacity={0.7} />
              <stop offset="1" stopColor="#0f766e" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="riverMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#14b8a6" stopOpacity={0.5} />
              <stop offset="1" stopColor="#ccfbf1" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="riverSurf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5eead4" stopOpacity={0.4} />
              <stop offset="1" stopColor="#f0fdfa" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {/* Deep water — widest layer, receding to narrow horizon */}
          <path
            d="M140,0 C160,0 240,0 260,0 C320,200 370,400 430,800 L-30,800 C-20,400 30,200 140,0 Z"
            fill="url(#riverDeep)"
          />

          {/* Mid water */}
          <path
            d="M153,0 C168,0 232,0 247,0 C297,200 340,400 395,800 L5,800 C15,400 42,200 153,0 Z"
            fill="url(#riverMid)"
          />

          {/* Surface water — narrowest, lightest */}
          <path
            d="M165,0 C175,0 225,0 235,0 C275,200 315,400 365,800 L35,800 C55,400 70,200 165,0 Z"
            fill="url(#riverSurf)"
          />

          {/* Flowing wave lines — wider near bottom for perspective */}
          {WAVES.map((w, i) => (
            <motion.path
              key={i}
              d={wavePath(w.y, w.width)}
              stroke="white"
              strokeWidth={1 + i * 0.25}
              strokeLinecap="round"
              fill="none"
              opacity={0.15 + i * 0.03}
              strokeDasharray={`${3 + i} ${6 + i * 2}`}
              animate={{ strokeDashoffset: [-(10 + i * 3), 0] }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
