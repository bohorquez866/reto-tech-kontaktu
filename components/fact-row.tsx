import type { FactView } from "@/lib/types";

export function FactRow({ fact }: { fact: FactView }) {
  return (
    <li className="grid gap-1 py-2.5 sm:grid-cols-[8.5rem_1fr_auto] sm:items-baseline sm:gap-4">
      <span className="text-sm text-muted">{fact.label}</span>
      <span className="text-pretty text-sm tabular-nums">{fact.displayValue}</span>
      <span className="text-xs text-muted sm:text-right">
        {fact.provenanceLabel}
        {fact.updatedAtLabel ? (
          <span className="tabular-nums"> · {fact.updatedAtLabel}</span>
        ) : null}
      </span>
    </li>
  );
}
