import { assessCompliance } from "./compliance";
import { HOME_ORG_ID } from "./constants";
import { findDuplicates } from "./duplicates";
import { normalizeEmail } from "./email";
import { displayNameFor, initialsFor } from "./identity";
import { formatDateLabel, parseDate } from "./parse-date";
import { parseQualification } from "./parse-qualification";
import { normalizePhone } from "./phone";
import { normalizeSource } from "./source";
import type {
  ContactListItem,
  ContactViewModel,
  InteractionView,
  RawContact,
  RawInteraction,
} from "./types";

function asNumber(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function normalizeInteraction(raw: RawInteraction): InteractionView {
  const source = normalizeSource(raw.channel);
  const date = parseDate(raw.created_at);
  const metadata = raw.metadata ?? {};

  return {
    id: raw.id,
    channel: source.channel,
    channelLabel: source.label,
    direction: raw.direction,
    createdAt: date ? date.getTime() : null,
    createdAtLabel: formatDateLabel(date, true),
    content: raw.content,
    durationSec: asNumber(metadata.duration_sec),
    transcript: asString(metadata.transcript_excerpt),
    propertyRef: asString(metadata.property_ref),
    form: asString(metadata.form),
  };
}

export function normalizeContact(
  raw: RawContact,
  all: RawContact[],
): ContactViewModel {
  const phone = normalizePhone(raw.phone);
  const email = normalizeEmail(raw.email);
  const displayName = displayNameFor(raw, phone, email);
  const interactions = (raw.interactions ?? [])
    .map(normalizeInteraction)
    .sort((a, b) => {
      if (a.createdAt == null && b.createdAt == null) return 0;
      if (a.createdAt == null) return 1;
      if (b.createdAt == null) return -1;
      return b.createdAt - a.createdAt;
    });

  const last = interactions.find((item) => item.createdAt != null) ?? null;

  return {
    id: raw.id,
    organizationId: raw.organization_id,
    isWrongOrg: raw.organization_id !== HOME_ORG_ID,
    displayName,
    initials: initialsFor(displayName),
    phone,
    email,
    source: normalizeSource(raw.lead_source),
    createdAtLabel: formatDateLabel(parseDate(raw.created_at)),
    qualification: parseQualification(raw.qualification_data),
    interactions,
    lastInteraction: last
      ? { channelLabel: last.channelLabel, createdAtLabel: last.createdAtLabel }
      : null,
    compliance: assessCompliance(raw),
    duplicates: findDuplicates(raw, all),
    flags: {
      isTest: Boolean(raw.is_test),
      isHandoff: Boolean(raw.ai_handoff),
      handoffReason: raw.handoff_reason ?? null,
    },
    notes: raw.notes ?? null,
  };
}

export function toListItem(contact: ContactViewModel): ContactListItem {
  return {
    id: contact.id,
    displayName: contact.displayName,
    initials: contact.initials,
    source: contact.source,
    lastInteraction: contact.lastInteraction,
    isTest: contact.flags.isTest,
    isWrongOrg: contact.isWrongOrg,
    isDoNotCall: contact.compliance.blocked,
  };
}
