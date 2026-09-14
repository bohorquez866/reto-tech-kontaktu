import Link from "next/link";
import { HOME_ORG_NAME } from "@/lib/constants";

export function AppShell({
  children,
  eyebrow,
}: {
  children: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="min-w-0">
            <p className="font-mono text-[11px] tracking-wide text-muted uppercase">
              Kontaktu · CRM
            </p>
            <p className="truncate text-sm font-medium text-ink">{HOME_ORG_NAME}</p>
          </Link>
          {eyebrow ? (
            <p className="hidden text-sm text-muted sm:block">{eyebrow}</p>
          ) : null}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
