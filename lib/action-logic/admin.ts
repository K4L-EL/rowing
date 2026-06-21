export function buildStatusChangeNote(status: string, note?: string): string {
  return note?.trim() || `Status updated to ${status}`;
}

export function buildAssignNote(
  assignedToId: string | null,
  notes?: string,
): string {
  if (!assignedToId) return "Unassigned";
  return `Assigned to user ${assignedToId}${notes ? ` — ${notes}` : ""}`;
}
