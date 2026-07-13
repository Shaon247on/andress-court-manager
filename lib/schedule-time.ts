// lib/schedule-time.ts

/** Parses "HH:MM" or "HH:MM:SS" into a decimal hour, e.g. "14:30" -> 14.5 */
export function timeToHours(time: string): number {
  const [h, m] = time.split(':');
  return parseInt(h, 10) + (parseInt(m ?? '0', 10) || 0) / 60;
}

/** Formats a decimal hour back into "HH:MM", e.g. 14.5 -> "14:30" */
export function hoursToTimeString(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/** Parses a "YYYY-MM-DD" string as a local date (avoids UTC off-by-one shifts) */
export function parseDateString(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}