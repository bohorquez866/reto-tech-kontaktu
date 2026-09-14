import { loadRawContacts, simulateLatency } from "@/lib/load-contacts";
import { normalizeContact } from "@/lib/normalize-contact";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  await simulateLatency();
  const { id } = await context.params;
  const raw = await loadRawContacts();
  const contact = raw.find((item) => item.id === id);

  if (!contact) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  return Response.json({ contact: normalizeContact(contact, raw) });
}
