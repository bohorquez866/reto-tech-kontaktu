const TZ = "Europe/Madrid";

const MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function madridOffset(month: number): string {
  return month >= 4 && month <= 10 ? "+02:00" : "+01:00";
}

export function parseDate(value: unknown): Date | null {
  if (value == null || value === "") return null;

  if (typeof value === "number") {
    const ms = value < 1e12 ? value * 1000 : value;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value !== "string") return null;
  const text = value.trim();

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    const date = new Date(text);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const dmy = text.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/,
  );
  if (dmy) {
    const [, day, month, year, hours, minutes] = dmy;
    const m = Number(month);
    const iso = `${year}-${pad(m)}-${pad(Number(day))}T${pad(hours ? Number(hours) : 0)}:${pad(minutes ? Number(minutes) : 0)}:00${madridOffset(m)}`;
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const fallback = new Date(text);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function madridParts(date: Date) {
  const parts = new Intl.DateTimeFormat("es-ES", {
    timeZone: TZ,
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    day: Number(get("day")),
    month: Number(get("month")),
    year: Number(get("year")),
    hour: get("hour"),
    minute: get("minute"),
  };
}

export function formatDateLabel(date: Date | null, withTime = false): string {
  if (!date) return "Fecha desconocida";
  const parts = madridParts(date);
  const label = `${parts.day} ${MONTHS[parts.month - 1]} ${parts.year}`;
  if (!withTime) return label;
  return `${label} · ${parts.hour}:${parts.minute}`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}
