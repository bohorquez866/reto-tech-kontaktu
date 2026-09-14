import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";
import { assessCompliance } from "./compliance";
import { normalizeContact } from "./normalize-contact";
import { parseDate } from "./parse-date";
import { parseQualification } from "./parse-qualification";
import { normalizePhone } from "./phone";
import { titleCaseEs } from "./identity";
import type { RawContact } from "./types";

const payload = JSON.parse(readFileSync("contactos.json", "utf8")) as {
  contacts: RawContact[];
};
const contacts = payload.contacts;
const byId = (id: string) => contacts.find((contact) => contact.id === id)!;

describe("phone", () => {
  it("collapses Carmen formats to the same E.164", () => {
    const carmen = normalizePhone("+34 655 12 34 56")!.e164;
    expect(carmen).toBe("+34655123456");
    expect(normalizePhone("655123456")!.e164).toBe(carmen);
  });

  it("normalizes the planted phone formats", () => {
    expect(normalizePhone("0034612889034")!.e164).toBe("+34612889034");
    expect(normalizePhone("699112233")!.e164).toBe("+34699112233");
    expect(normalizePhone("+34688456789")!.e164).toBe("+34688456789");
    expect(normalizePhone("+34-644-556-677")!.e164).toBe("+34644556677");
  });
});

describe("dates", () => {
  it("parses DD/MM/YYYY HH:mm as Madrid civil time", () => {
    const date = parseDate("11/07/2026 18:42");
    expect(date).not.toBeNull();
    const parts = new Intl.DateTimeFormat("es-ES", {
      timeZone: "Europe/Madrid",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date!);
    const get = (type: string) => parts.find((part) => part.type === type)?.value;
    expect(get("day")).toBe("11");
    expect(get("month")).toBe("7");
    expect(get("year")).toBe("2026");
    expect(get("hour")).toBe("18");
    expect(get("minute")).toBe("42");
  });

  it("parses unix seconds for c-012", () => {
    const date = parseDate(byId("c-012").created_at);
    expect(date).not.toBeNull();
    expect(date!.getFullYear()).toBe(2026);
  });
});

describe("identity", () => {
  it("title-cases ALL CAPS and lowercase names", () => {
    expect(titleCaseEs("JOSÉ LUIS MARTÍN CABRERA")).toBe("José Luis Martín Cabrera");
    expect(titleCaseEs("carmen ruiz")).toBe("Carmen Ruiz");
  });
});

describe("qualification", () => {
  it("parses string JSON for Antonio (c-003)", () => {
    const groups = parseQualification(byId("c-003").qualification_data);
    expect(groups.some((group) => group.id === "rental")).toBe(true);
    const budget = groups.flatMap((group) => group.facts).find((fact) => fact.key === "budget");
    expect(budget?.displayValue).toMatch(/1.?400/);
  });

  it("keeps Roberto's manual budget of 350.000 €", () => {
    const view = normalizeContact(byId("c-008"), contacts);
    const budget = view.qualification
      .flatMap((group) => group.facts)
      .find((fact) => fact.key === "budget");
    expect(budget?.displayValue).toMatch(/350/);
    expect(budget?.provenance).toBe("agent");
    expect(view.qualification.some((group) => group.id === "other")).toBe(true);
  });

  it("renders unknown keys for Marta (c-007)", () => {
    const view = normalizeContact(byId("c-007"), contacts);
    const keys = view.qualification.flatMap((group) => group.facts).map((fact) => fact.key);
    expect(keys).toContain("accesibilidad_movilidad_reducida");
    expect(keys).toContain("floor_pref");
  });
});

describe("duplicates", () => {
  it("links Carmen c-001 and c-009 by phone", () => {
    const rich = normalizeContact(byId("c-001"), contacts);
    const sparse = normalizeContact(byId("c-009"), contacts);
    expect(rich.duplicates.map((item) => item.id)).toContain("c-009");
    expect(sparse.duplicates.map((item) => item.id)).toContain("c-001");
  });
});

describe("compliance", () => {
  it("blocks call/WhatsApp for Sofía and keeps email", () => {
    const view = normalizeContact(byId("c-013"), contacts);
    expect(view.compliance.canCall).toBe(false);
    expect(view.compliance.canWhatsApp).toBe(false);
    expect(view.compliance.canEmail).toBe(true);
    expect(assessCompliance(byId("c-001")).canCall).toBe(true);
  });
});

describe("fallbacks", () => {
  it("uses the phone as name when full_name is missing", () => {
    const view = normalizeContact(byId("c-004"), contacts);
    expect(view.displayName).toMatch(/688/);
  });

  it("flags Lucía email as valid and María Dolores as invalid", () => {
    expect(normalizeContact(byId("c-005"), contacts).email?.valid).toBe(true);
    expect(normalizeContact(byId("c-015"), contacts).email?.valid).toBe(false);
  });
});
