export function validateCrewSheetDate(date: string): Date | null {
  const day = new Date(date);
  if (Number.isNaN(day.getTime())) return null;
  day.setUTCHours(0, 0, 0, 0);
  return day;
}
