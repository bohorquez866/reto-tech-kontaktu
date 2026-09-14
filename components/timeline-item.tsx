import { cn } from "@/lib/cn";
import { formatDuration } from "@/lib/parse-date";
import type { InteractionView } from "@/lib/types";

const DIRECTION: Record<string, string> = {
  inbound: "entrante",
  outbound: "saliente",
};

export function TimelineItemRow({ item }: { item: InteractionView }) {
  const direction = item.direction
    ? (DIRECTION[item.direction] ?? item.direction)
    : null;
  const isWhatsApp = item.channel === "whatsapp";

  return (
    <li className="border-line border-l-2 pl-4">
      <p className="text-sm">
        <span className="font-medium">{item.channelLabel}</span>
        {direction ? <span className="text-muted"> · {direction}</span> : null}
        <span className="tabular-nums text-muted">
          {" "}
          · {item.createdAtLabel}
        </span>
        {item.durationSec != null ? (
          <span className="font-mono text-muted">
            {" "}
            · {formatDuration(item.durationSec)}
          </span>
        ) : null}
      </p>
      {item.propertyRef ? (
        <p className="mt-1 font-mono text-xs text-muted">
          {item.form ? `${item.form} · ` : null}
          {item.propertyRef}
        </p>
      ) : null}
      {item.content ? (
        <p
          className={cn(
            "mt-1 text-pretty text-sm",
            isWhatsApp && "max-w-prose rounded-2xl bg-canvas px-3 py-2",
            isWhatsApp && item.direction === "outbound" && "bg-accent-fg",
          )}
        >
          {item.content}
        </p>
      ) : null}
      {item.transcript ? (
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-accent">
            Ver transcripción
          </summary>
          <pre className="mt-2 font-mono text-pretty text-xs whitespace-pre-wrap text-muted">
            {item.transcript}
          </pre>
        </details>
      ) : null}
    </li>
  );
}
