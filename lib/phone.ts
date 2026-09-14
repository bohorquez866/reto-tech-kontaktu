import { parsePhoneNumberFromString } from "libphonenumber-js";
import type { PhoneView } from "./types";

function prepare(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("00")) return `+${trimmed.slice(2)}`;
  return trimmed;
}

export function normalizePhone(raw: string | null | undefined): PhoneView | null {
  if (!raw || !raw.trim()) return null;

  const original = raw.trim();
  const prepared = prepare(original);
  const parsed =
    parsePhoneNumberFromString(prepared, "ES") ??
    parsePhoneNumberFromString(prepared.replace(/[^\d+]/g, ""), "ES");

  if (!parsed?.isValid()) {
    const digits = original.replace(/[^\d+]/g, "");
    return {
      raw: original,
      e164: null,
      display: original,
      whatsappUrl: null,
      telUrl: digits ? `tel:${digits}` : null,
    };
  }

  const e164 = parsed.number;
  return {
    raw: original,
    e164,
    display: parsed.formatInternational(),
    whatsappUrl: `https://wa.me/${e164.replace("+", "")}`,
    telUrl: `tel:${e164}`,
  };
}
