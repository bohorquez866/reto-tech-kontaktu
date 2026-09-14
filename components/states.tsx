export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-line bg-paper px-5 py-8 text-center">
      <p className="font-medium">No se ha podido cargar</p>
      <p className="mt-1 text-sm text-muted">Revisa la conexión e inténtalo de nuevo.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg"
      >
        Reintentar
      </button>
    </div>
  );
}

export function NotFoundState() {
  return (
    <div className="rounded-2xl border border-line bg-paper px-5 py-8 text-center">
      <p className="font-medium">No está en Miralvento</p>
      <p className="mt-1 text-sm text-muted">
        Este identificador no aparece en el export de contactos.
      </p>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper" aria-busy>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex gap-3 border-b border-line px-4 py-4 last:border-0">
          <div className="size-10 rounded-full bg-canvas" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3 w-40 rounded bg-canvas" />
            <div className="h-3 w-56 rounded bg-canvas" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FichaSkeleton() {
  return (
    <div className="mt-4 space-y-4" aria-busy>
      <div className="h-28 rounded-2xl border border-line bg-paper" />
      <div className="h-40 rounded-2xl border border-line bg-paper" />
      <div className="h-40 rounded-2xl border border-line bg-paper" />
    </div>
  );
}
