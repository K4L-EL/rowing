/**
 * Parse a welfare report payload that may be a JSON string (SQLite)
 * or already an object (Postgres JSONB).
 */
export function parsePayload(raw: unknown): unknown {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
}
