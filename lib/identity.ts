import type { EmailView, PhoneView, RawContact } from "./types";

const PARTICLES = new Set(["de", "del", "la", "las", "los", "y", "da", "do"]);

export function titleCaseEs(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLocaleLowerCase("es-ES");
      if (index > 0 && PARTICLES.has(lower)) return lower;
      if (!lower) return word;
      return lower.charAt(0).toLocaleUpperCase("es-ES") + lower.slice(1);
    })
    .join(" ");
}

export function displayNameFor(
  contact: Pick<RawContact, "full_name">,
  phone: PhoneView | null,
  email: EmailView | null,
): string {
  if (contact.full_name?.trim()) return titleCaseEs(contact.full_name);
  if (phone?.display) return phone.display;
  if (email?.display) return email.display;
  return "Contacto sin identificar";
}

export function initialsFor(name: string): string {
  if (name.startsWith("+") || /^\d/.test(name)) {
    const digits = name.replace(/\D/g, "");
    return digits.slice(-2) || "?";
  }

  const parts = name
    .split(/\s+/)
    .filter((part) => /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(part))
    .slice(0, 2);

  if (parts.length === 0) return "?";
  return parts.map((part) => part[0].toLocaleUpperCase("es-ES")).join("");
}
