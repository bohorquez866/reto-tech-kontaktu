import type { InteractionView } from "@/lib/types";
import { TimelineItemRow } from "./timeline-item";

export function Timeline({ items }: { items: InteractionView[] }) {
  return (
    <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
        Actividad
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 max-w-lg text-pretty text-sm text-muted">
          Todavía no hay conversaciones. Cualifica a esta persona en la primera
          llamada o WhatsApp — zona, presupuesto y urgencia bastan para empezar.
        </p>
      ) : (
        <ol className="mt-4 space-y-4">
          {items.map((item) => (
            <TimelineItemRow key={item.id} item={item} />
          ))}
        </ol>
      )}
    </section>
  );
}
