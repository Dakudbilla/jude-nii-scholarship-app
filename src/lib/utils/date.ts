/**
 * Normalises the various shapes a Firebase Timestamp can arrive in across
 * the wire and returns a native Date — or null when absent / unparseable.
 *
 * Shapes handled:
 *   • Admin SDK serialised JSON:  { _seconds: number, _nanoseconds: number }
 *   • Client SDK Timestamp:       { toDate(): Date }
 *   • Plain ISO string / epoch number
 */
export function toDate(value: unknown): Date | null {
  if (!value) return null;

  if (typeof value === "object" && value !== null) {
    // Admin SDK → serialised JSON
    const obj = value as Record<string, unknown>;
    if (typeof obj._seconds === "number") {
      return new Date(obj._seconds * 1000);
    }
    // Client SDK Timestamp
    if (typeof (obj as { toDate?: unknown }).toDate === "function") {
      return (obj as { toDate: () => Date }).toDate();
    }
  }

  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

export function formatDate(
  value: unknown,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" },
  locale = "en-GB"
): string {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleDateString(locale, options);
}

export function formatDateTime(value: unknown, locale = "en-GB"): string {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
}
