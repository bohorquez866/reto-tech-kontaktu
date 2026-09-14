"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ActionBar } from "@/components/action-bar";
import { AppShell } from "@/components/app-shell";
import { Banners } from "@/components/banners";
import { IdentityHeader } from "@/components/identity-header";
import { QualificationSection } from "@/components/qualification-section";
import { ErrorState, FichaSkeleton, NotFoundState } from "@/components/states";
import { Timeline } from "@/components/timeline";
import type { ContactViewModel } from "@/lib/types";

export function ContactFicha({ id }: { id: string }) {
  const [contact, setContact] = useState<ContactViewModel | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ok" | "empty">(
    "loading",
  );
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/contactos/${id}`)
      .then(async (response) => {
        if (response.status === 404) return { kind: "empty" as const };
        if (!response.ok) throw new Error("fail");
        const body = (await response.json()) as { contact: ContactViewModel };
        return { kind: "ok" as const, contact: body.contact };
      })
      .then((result) => {
        if (cancelled) return;
        if (result.kind === "empty") {
          setStatus("empty");
          return;
        }
        setContact(result.contact);
        setStatus("ok");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [id, nonce]);

  return (
    <AppShell eyebrow="Ficha de contacto">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Contactos
      </Link>

      {status === "loading" ? <FichaSkeleton /> : null}
      {status === "error" ? (
        <div className="mt-8">
          <ErrorState
            onRetry={() => {
              setStatus("loading");
              setContact(null);
              setNonce((value) => value + 1);
            }}
          />
        </div>
      ) : null}
      {status === "empty" ? (
        <div className="mt-8">
          <NotFoundState />
        </div>
      ) : null}
      {status === "ok" && contact ? (
        <article className="mt-4 space-y-4">
          <Banners contact={contact} />
          <section className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <IdentityHeader contact={contact} />
            <div className="mt-5">
              <ActionBar contact={contact} />
            </div>
          </section>
          <QualificationSection groups={contact.qualification} />
          <Timeline items={contact.interactions} />
        </article>
      ) : null}
    </AppShell>
  );
}
