export default function SetupNeeded() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-site-orange mb-2">Setup needed</p>
      <h1 className="font-display text-4xl uppercase mb-4">Firebase isn’t connected yet</h1>
      <p className="text-ink-soft mb-6">
        This app needs your Firebase project’s config to work. Copy{' '}
        <code className="bg-paper-dim px-1.5 py-0.5 rounded font-mono text-sm">.env.example</code> to{' '}
        <code className="bg-paper-dim px-1.5 py-0.5 rounded font-mono text-sm">.env</code> and fill in the
        values from your Firebase console (Project settings → General → Your apps → SDK setup and
        configuration), then restart the dev server.
      </p>
      <p className="text-ink-soft text-sm">Full setup steps are in the project’s README.md.</p>
    </div>
  )
}
