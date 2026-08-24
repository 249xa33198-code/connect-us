export function LoadingBlock({ label = 'Loading' }) {
  return (
    <div className="flex items-center gap-3 py-12 justify-center text-ink-soft">
      <span
        className="h-4 w-4 rounded-full border-2 border-line border-t-safety-dark animate-spin"
        aria-hidden="true"
      />
      <span className="font-mono text-sm tracking-wide">{label}…</span>
    </div>
  )
}

export function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="border-2 border-danger/40 bg-danger/5 text-danger px-4 py-3 rounded-md flex items-start justify-between gap-4">
      <p className="text-sm font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-mono underline underline-offset-2 shrink-0 hover:text-danger/80"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="text-center py-16 px-6 border-2 border-dashed border-line rounded-lg">
      <p className="font-display text-2xl uppercase tracking-wide text-ink mb-1">{title}</p>
      {body && <p className="text-ink-soft text-sm max-w-sm mx-auto mb-4">{body}</p>}
      {action}
    </div>
  )
}
