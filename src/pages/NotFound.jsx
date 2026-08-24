import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety-dark mb-2">404</p>
      <h1 className="font-display text-4xl uppercase mb-3">Page not found</h1>
      <p className="text-ink-soft text-sm mb-6">The page you’re looking for doesn’t exist or was moved.</p>
      <Link to="/" className="font-mono text-xs uppercase underline underline-offset-2 text-trust">
        Back home
      </Link>
    </div>
  )
}
