import type { ReactNode } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import type { ContactViewModel } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ActionBar({ contact }: { contact: ContactViewModel }) {
  const callHref =
    contact.compliance.canCall && contact.phone?.telUrl
      ? contact.phone.telUrl
      : null;
  const waHref =
    contact.compliance.canWhatsApp && contact.phone?.whatsappUrl
      ? contact.phone.whatsappUrl
      : null;
  const mailHref =
    contact.compliance.canEmail && contact.email?.valid
      ? `mailto:${contact.email.display}`
      : null;

  return (
    <div className="flex flex-wrap gap-2">
      <Action
        href={callHref}
        disabledReason={
          contact.compliance.blocked
            ? "Bloqueado: pidió no ser llamada"
            : "No hay teléfono"
        }
        icon={<Phone className="size-4" aria-hidden />}
        label="Llamar"
      />
      <Action
        href={waHref}
        disabledReason={
          contact.compliance.blocked
            ? "Bloqueado: pidió no ser llamada"
            : "No hay WhatsApp"
        }
        icon={<MessageCircle className="size-4" aria-hidden />}
        label="WhatsApp"
      />
      <Action
        href={mailHref}
        disabledReason="No hay email válido"
        icon={<Mail className="size-4" aria-hidden />}
        label="Email"
      />
    </div>
  );
}

function Action({
  href,
  disabledReason,
  icon,
  label,
}: {
  href: string | null;
  disabledReason: string;
  icon: ReactNode;
  label: string;
}) {
  const className = cn(
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
    href
      ? "bg-accent text-accent-fg hover:bg-accent/90"
      : "cursor-not-allowed bg-canvas text-muted",
  );

  if (!href) {
    return (
      <button type="button" className={className} disabled title={disabledReason}>
        {icon}
        {label}
      </button>
    );
  }

  return (
    <a className={className} href={href}>
      {icon}
      {label}
    </a>
  );
}
