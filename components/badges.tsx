import { cn } from "@/lib/cn";
import type { ChannelKind } from "@/lib/types";

const LABELS: Record<ChannelKind, string> = {
  voice: "Llamada",
  whatsapp: "WhatsApp",
  web: "Web",
  meta: "Meta",
  import: "Importación",
  crm: "CRM",
  email: "Email",
  unknown: "Desconocido",
};

export function ChannelBadge({
  channel,
  label,
}: {
  channel: ChannelKind;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-canvas px-2 py-0.5 font-mono text-[11px] text-ink",
      )}
    >
      {label ?? LABELS[channel]}
    </span>
  );
}

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "danger" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[11px]",
        tone === "danger" && "bg-danger-bg text-danger",
        tone === "warning" && "bg-warning-bg text-warning",
        tone === "neutral" && "bg-canvas text-muted border border-line",
      )}
    >
      {children}
    </span>
  );
}
