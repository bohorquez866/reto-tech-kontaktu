import { loadRawContacts, simulateLatency } from "@/lib/load-contacts";
import { normalizeContact, toListItem } from "@/lib/normalize-contact";

export async function GET() {
  await simulateLatency();
  const raw = await loadRawContacts();
  const contacts = raw.map((contact) => toListItem(normalizeContact(contact, raw)));
  return Response.json({ contacts });
}
