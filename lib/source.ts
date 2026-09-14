import type { ChannelKind, SourceView } from "./types";

const SOURCE_MAP: Record<string, { label: string; channel: ChannelKind }> = {
  voice_call: { label: "Llamada", channel: "voice" },
  llamada: { label: "Llamada", channel: "voice" },
  voz: { label: "Llamada", channel: "voice" },
  voice: { label: "Llamada", channel: "voice" },
  whatsapp: { label: "WhatsApp", channel: "whatsapp" },
  website: { label: "Web", channel: "web" },
  web_form: { label: "Formulario", channel: "web" },
  meta_lead_ads: { label: "Meta", channel: "meta" },
  witei: { label: "Importación", channel: "import" },
  crm: { label: "CRM", channel: "crm" },
  email: { label: "Email", channel: "email" },
};

export function normalizeSource(raw: string | null | undefined): SourceView {
  if (!raw || !raw.trim()) {
    return { raw: raw ?? null, label: "Desconocido", channel: "unknown" };
  }

  const mapped = SOURCE_MAP[raw.trim().toLowerCase()];
  if (mapped) return { raw, ...mapped };
  return { raw, label: "Desconocido", channel: "unknown" };
}

export function directionLabel(raw: string | null | undefined): string {
  if (raw?.toLowerCase() === "outbound") return "Saliente";
  if (raw?.toLowerCase() === "inbound") return "Entrante";
  return "";
}
