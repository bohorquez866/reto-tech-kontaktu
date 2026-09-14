import type { QualificationGroup } from "@/lib/types";
import { FactRow } from "./fact-row";

export function QualificationSection({
  groups,
}: {
  groups: QualificationGroup[];
}) {
  return (
    <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
        Cualificación
      </h2>
      {groups.length === 0 ? (
        <p className="mt-3 max-w-lg text-pretty text-sm text-muted">
          Aún no hay hechos de cualificación. En la próxima conversación pregunta
          zona, presupuesto y tipo de operación — no dejes la ficha muda.
        </p>
      ) : (
        <div className="mt-4 space-y-5">
          {groups.map((group) => (
            <div key={group.id}>
              <h3 className="text-xs font-medium uppercase tracking-wide text-accent">
                {group.label}
              </h3>
              <ul className="mt-2 divide-y divide-line">
                {group.facts.map((fact) => (
                  <FactRow key={`${group.id}-${fact.key}`} fact={fact} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
