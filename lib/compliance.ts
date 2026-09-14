import { normalizeEmail } from "./email";
import { normalizePhone } from "./phone";
import type { ComplianceView, RawContact } from "./types";

const DO_NOT_CALL_RE =
  /no[- ]llamar|dejen de (contactarme|llamarme) por tel[eé]fono|contactar solo por email|escr[ií]banme por email [uú]nicamente|dejen de llamarla/i;

export function assessCompliance(contact: RawContact) {
  const tags = (contact.tags ?? []).map((tag) => tag.toLowerCase());
  const notes = contact.notes ?? "";
  const interactionText = (contact.interactions ?? [])
    .map((item) => item.content ?? "")
    .join(" ");
  const blob = `${notes}\n${interactionText}`;

  const tagged = tags.includes("no-llamar");
  const asked = DO_NOT_CALL_RE.test(blob);
  const reasons: string[] = [];
  if (tagged) reasons.push("Marcado como no llamar");
  if (asked) reasons.push("Pidió contacto solo por email");

  const blocked = tagged || asked;
  const hasPhone = Boolean(normalizePhone(contact.phone)?.e164);
  const email = normalizeEmail(contact.email);

  const result: ComplianceView = {
    canCall: !blocked && hasPhone,
    canWhatsApp: !blocked && hasPhone,
    canEmail: Boolean(email?.valid),
    blocked,
    reasons,
  };
  return result;
}
