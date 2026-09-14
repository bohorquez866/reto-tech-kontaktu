import type { ReactNode } from "react";
import Link from "next/link";
import type { ContactViewModel } from "@/lib/types";

export function Banners({ contact }: { contact: ContactViewModel }) {
  return (
    <div className="space-y-2">
      {contact.compliance.blocked ? (
        <Banner tone="danger" title="No llamar">
          {`${contact.compliance.reasons.join(". ") || "Pidió contacto solo por email"}. Llamada y WhatsApp están bloqueados.`}
        </Banner>
      ) : null}
      {contact.duplicates.map((dup) => (
        <Banner key={dup.id} tone="warning" title="Posible duplicado">
          Mismo teléfono que{" "}
          <Link className="underline" href={`/contactos/${dup.id}`}>
            {dup.displayName}
          </Link>
          . Propuesta de fusión: conservar el nombre más completo, unir
          interacciones y cualificación, y archivar el duplicado. El merge no
          está implementado.
        </Banner>
      ))}
      {contact.flags.isHandoff ? (
        <Banner tone="warning" title="Quiere hablar con una persona">
          {contact.flags.handoffReason ?? "Pidió handoff a un agente humano."}
        </Banner>
      ) : null}
      {contact.isWrongOrg ? (
        <Banner tone="neutral" title="Otra organización">
          Este contacto no es de Miralvento ({contact.organizationId}). Está en
          el export y se muestra, no se oculta.
        </Banner>
      ) : null}
      {contact.flags.isTest ? (
        <Banner tone="neutral" title="Contacto de prueba">
          No lo trates como un lead real.
        </Banner>
      ) : null}
    </div>
  );
}

function Banner({
  title,
  children,
  tone,
}: {
  title: string;
  children: ReactNode;
  tone: "danger" | "warning" | "neutral";
}) {
  const styles = {
    danger: "border-danger/30 bg-danger-bg text-danger",
    warning: "border-warning/30 bg-warning-bg text-warning",
    neutral: "border-line bg-paper text-muted",
  }[tone];

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <p className="font-medium text-ink">{title}</p>
      <p className="mt-1 text-pretty">{children}</p>
    </div>
  );
}
