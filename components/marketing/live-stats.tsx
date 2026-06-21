"use client";

import { useEffect, useState } from "react";
import { AnimatedCounter } from "./animated-counter";

export function LiveStats() {
  const [stats, setStats] = useState<{ reportCount: number; memberCount: number } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});
  }, []);

  return (
    <div className="grid gap-10 sm:grid-cols-4">
      <AnimatedCounter target={stats?.memberCount ?? 8} suffix="+" label="Active members" />
      <AnimatedCounter target={stats?.reportCount ?? 9} label="Welfare reports filed" />
      <AnimatedCounter target={100} suffix="%" label="Free to start" />
      <AnimatedCounter target={50} suffix="+" label="Events hosted" />
    </div>
  );
}
