import Link from "next/link";
import type { ContactListItem } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ContactList({ contacts }: { contacts: ContactListItem[] }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
      {contacts.map((contact) => (
        <li key={contact.id}>
          <Link
            href={`/contactos/${contact.id}`}
            className="flex items-start gap-3 px-4 py-3.5 hover:bg-canvas"
          >
            <span
              aria-hidden
              className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-info-bg text-xs font-medium text-accent"
            >
              {contact.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="truncate font-medium">{contact.displayName}</span>
                {contact.isDoNotCall ? (
                  <Badge tone="danger">No llamar</Badge>
                ) : null}
                {contact.isWrongOrg ? <Badge>Otra organización</Badge> : null}
                {contact.isTest ? <Badge>Prueba</Badge> : null}
              </span>
              <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
                <span>{contact.source.label}</span>
                {contact.lastInteraction ? (
                  <span className="tabular-nums">
                    {contact.lastInteraction.channelLabel} ·{" "}
                    {contact.lastInteraction.createdAtLabel}
                  </span>
                ) : (
                  <span>Sin interacciones</span>
                )}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Badge({
  children,
  tone,
}: {
  children: string;
  tone?: "danger";
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        tone === "danger" ? "bg-danger-bg text-danger" : "bg-canvas text-muted",
      )}
    >
      {children}
    </span>
  );
}
