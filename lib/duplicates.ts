import { displayNameFor } from "./identity";
import { normalizeEmail } from "./email";
import { normalizePhone } from "./phone";
import type { DuplicateView, RawContact } from "./types";

export function findDuplicates(
  contact: RawContact,
  all: RawContact[],
): DuplicateView[] {
  const e164 = normalizePhone(contact.phone)?.e164;
  if (!e164) return [];

  return all
    .filter((other) => other.id !== contact.id)
    .filter((other) => normalizePhone(other.phone)?.e164 === e164)
    .map((other) => {
      const phone = normalizePhone(other.phone);
      const email = normalizeEmail(other.email);
      return {
        id: other.id,
        displayName: displayNameFor(other, phone, email),
        reason: "Mismo teléfono",
      };
    });
}
