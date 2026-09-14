import type { ContactViewModel } from "@/lib/types";
import { cn } from "@/lib/cn";

export function IdentityHeader({ contact }: { contact: ContactViewModel }) {
  return (
    <header className="flex items-start gap-4">
      <span
        aria-hidden
        className="grid size-14 shrink-0 place-items-center rounded-full bg-info-bg font-serif text-lg text-accent"
      >
        {contact.initials}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-serif text-2xl text-balance sm:text-3xl">
            {contact.displayName}
          </h1>
          <span className="rounded-full bg-canvas px-2 py-0.5 text-[11px] font-medium uppercase text-muted">
            {contact.source.label}
          </span>
        </div>
        <p className="mt-1 font-mono text-sm tabular-nums text-muted">
          {contact.phone?.display ?? "Sin teléfono"}
          {contact.email ? (
            <>
              {" · "}
              <span className={cn(!contact.email.valid && "text-warning")}>
                {contact.email.display}
              </span>
            </>
          ) : null}
        </p>
        {contact.email && !contact.email.valid ? (
          <p className="mt-1 text-sm text-warning">Email no válido</p>
        ) : null}
        <p className="mt-1 text-sm text-muted">
          Alta: <span className="tabular-nums">{contact.createdAtLabel}</span>
        </p>
        {contact.notes ? (
          <p className="mt-3 text-pretty text-sm">{contact.notes}</p>
        ) : null}
      </div>
    </header>
  );
}
