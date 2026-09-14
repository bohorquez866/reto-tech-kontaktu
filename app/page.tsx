"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ContactList } from "@/components/contact-list";
import { ErrorState, ListSkeleton } from "@/components/states";
import type { ContactListItem } from "@/lib/types";

export default function HomePage() {
  const [contacts, setContacts] = useState<ContactListItem[] | null>(null);
  const [error, setError] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/contactos")
      .then(async (response) => {
        if (!response.ok) throw new Error("fail");
        return response.json() as Promise<{ contacts: ContactListItem[] }>;
      })
      .then((body) => {
        if (!cancelled) {
          setError(false);
          setContacts(body.contacts);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [nonce]);

  return (
    <AppShell eyebrow="Antes de llamar, abre la ficha">
      <p className="text-sm text-muted">Listado auxiliar</p>
      <h1 className="mt-1 font-serif text-3xl text-balance">Contactos</h1>
      <p className="mt-2 max-w-xl text-pretty text-sm text-muted">
        Identidad, origen y última interacción. El trabajo de verdad está en la
        ficha.
      </p>
      <div className="mt-6">
        {error ? (
          <ErrorState
            onRetry={() => {
              setError(false);
              setContacts(null);
              setNonce((value) => value + 1);
            }}
          />
        ) : null}
        {!error && !contacts ? <ListSkeleton /> : null}
        {contacts ? <ContactList contacts={contacts} /> : null}
      </div>
    </AppShell>
  );
}
