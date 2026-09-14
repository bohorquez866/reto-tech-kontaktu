import { formatDateLabel, parseDate } from "./parse-date";
import type { FactView, QualificationGroup, QualificationGroupId } from "./types";

const GROUP_ORDER: QualificationGroupId[] = ["sale", "rental", "shared", "other"];

const GROUP_LABELS: Record<QualificationGroupId, string> = {
  sale: "Compra",
  rental: "Alquiler",
  shared: "Comunes",
  other: "Otros",
};

const KEY_LABELS: Record<string, string> = {
  zones: "Zona",
  budget: "Presupuesto",
  bedrooms: "Habitaciones",
  financing: "Financiación",
  terrace: "Terraza",
  has_pets: "Mascotas",
  urgency: "Urgencia",
  floor_pref: "Planta",
  elevator: "Ascensor",
  orientation: "Orientación",
  garage: "Garaje",
  accesibilidad_movilidad_reducida: "Accesibilidad",
  net_income: "Ingresos netos",
  income_verified: "Ingresos verificados",
  income_source: "Origen de ingresos",
  income_updated_at: "Ingresos actualizados",
};

function humanizeKey(key: string): string {
  if (KEY_LABELS[key]) return KEY_LABELS[key];
  return key.replaceAll("_", " ").replace(/^\w/, (letter) => letter.toUpperCase());
}

function formatEuro(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatFactValue(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "number") {
    return value >= 1000 ? formatEuro(value) : String(value);
  }
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((item) => formatFactValue(item)).join(", ");
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if ("max" in record || "min" in record) {
      const parts: string[] = [];
      if (typeof record.min === "number") parts.push(`desde ${formatEuro(record.min)}`);
      if (typeof record.max === "number") parts.push(`hasta ${formatEuro(record.max)}`);
      return parts.join(" ") || "—";
    }
    try {
      return JSON.stringify(value);
    } catch {
      return "—";
    }
  }
  return String(value);
}

function provenanceOf(source?: string): Pick<FactView, "provenance" | "provenanceLabel"> {
  if (source === "manual") {
    return { provenance: "agent", provenanceLabel: "Editado por agente" };
  }
  if (source === "explicit") {
    return { provenance: "client", provenanceLabel: "Dicho por el cliente" };
  }
  return { provenance: "unknown", provenanceLabel: "Origen desconocido" };
}

function isFactShape(value: unknown): value is {
  value: unknown;
  source?: string;
  confidence?: string;
  updatedAt?: string;
} {
  return typeof value === "object" && value !== null && "value" in value;
}

export function toFact(key: string, raw: unknown): FactView {
  if (isFactShape(raw)) {
    const parsed = parseDate(raw.updatedAt);
    return {
      key,
      label: humanizeKey(key),
      value: raw.value,
      displayValue: formatFactValue(raw.value),
      ...provenanceOf(raw.source),
      updatedAtLabel: raw.updatedAt
        ? formatDateLabel(parsed)
        : "",
      confidence: raw.confidence ?? null,
    };
  }

  if (key.endsWith("_at")) {
    const parsed = parseDate(raw);
    return {
      key,
      label: humanizeKey(key),
      value: raw,
      displayValue: formatDateLabel(parsed),
      provenance: "unknown",
      provenanceLabel: "Origen desconocido",
      updatedAtLabel: "",
      confidence: null,
    };
  }

  return {
    key,
    label: humanizeKey(key),
    value: raw,
    displayValue: formatFactValue(raw),
    provenance: "unknown",
    provenanceLabel: "Origen desconocido",
    updatedAtLabel: "",
    confidence: null,
  };
}

function coerceQualification(data: unknown): Record<string, unknown> | null {
  if (data == null) return null;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as unknown;
      return typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : null;
    } catch {
      return null;
    }
  }
  if (typeof data === "object") return data as Record<string, unknown>;
  return null;
}

export function parseQualification(data: unknown): QualificationGroup[] {
  const parsed = coerceQualification(data);
  if (!parsed) return [];

  const qualification =
    parsed.qualification && typeof parsed.qualification === "object"
      ? (parsed.qualification as Record<string, unknown>)
      : {};

  const buckets: Record<QualificationGroupId, FactView[]> = {
    sale: [],
    rental: [],
    shared: [],
    other: [],
  };

  for (const id of ["sale", "rental", "shared"] as const) {
    const block = qualification[id];
    if (!block || typeof block !== "object") continue;
    for (const [key, value] of Object.entries(block as Record<string, unknown>)) {
      if (key === "_meta") continue;
      buckets[id].push(toFact(key, value));
    }
  }

  for (const [key, value] of Object.entries(qualification)) {
    if (key === "sale" || key === "rental" || key === "shared" || key === "_meta") continue;
    buckets.other.push(toFact(key, value));
  }

  for (const [key, value] of Object.entries(parsed)) {
    if (key === "qualification" || key === "income_updated_at" || key === "income_source") continue;
    const fact = toFact(key, value);
    if (key === "net_income" && parsed.income_updated_at) {
      fact.updatedAtLabel = formatDateLabel(parseDate(parsed.income_updated_at));
    }
    buckets.other.push(fact);
  }

  return GROUP_ORDER.filter((id) => buckets[id].length > 0).map((id) => ({
    id,
    label: GROUP_LABELS[id],
    facts: buckets[id],
  }));
}
