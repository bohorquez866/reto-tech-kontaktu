import { readFile } from "fs/promises";
import path from "path";
import { API_LATENCY_MS } from "./constants";
import type { ContactsExport, RawContact } from "./types";

let cache: ContactsExport | null = null;

export async function loadRawContacts(): Promise<RawContact[]> {
  if (!cache) {
    const file = path.join(process.cwd(), "contactos.json");
    const json = JSON.parse(await readFile(file, "utf8")) as ContactsExport;
    cache = json;
  }
  return cache.contacts;
}

export function simulateLatency(ms = API_LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
