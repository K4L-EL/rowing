/** Returns an array of 14 Date objects starting from today (UTC-normalised). */
export function nextFourteenDays(): Date[] {
  const days: Date[] = [];
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  for (let i = 0; i < 14; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    days.push(d);
  }
  return days;
}

export function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function formatDay(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}
