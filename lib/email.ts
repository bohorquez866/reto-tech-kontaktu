import type { EmailView } from "./types";

export function normalizeEmail(raw: string | null | undefined): EmailView | null {
  if (!raw || !raw.trim()) return null;
  const email = raw.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !email.includes("@@");
  return { raw: email, valid, display: email };
}
