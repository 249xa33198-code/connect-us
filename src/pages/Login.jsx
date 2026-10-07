import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ErrorBanner } from '../components/Feedback'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/browse'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError('Enter both email and password.')
      return
    }
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety-dark mb-2">Welcome back</p>
      <h1 className="font-display text-4xl uppercase mb-8">Log in</h1>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <label className="block">
          <span className="block text-sm font-medium mb-1">Email</span>
          <input
            type="email"
            className="w-full border-2 border-line focus:border-ink rounded-md px-3 py-2.5 bg-paper-dim text-ink placeholder:text-ink-soft focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">Password</span>
          <input
            type="password"
            className="w-full border-2 border-line focus:border-ink rounded-md px-3 py-2.5 bg-paper-dim text-ink placeholder:text-ink-soft focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-safety-dark text-paper font-mono text-sm uppercase tracking-wide py-3 rounded hover:bg-ink transition-colors disabled:opacity-50"
        >
          {submitting ? 'Logging in\u2026' : 'Log in'}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        New here?{' '}
        <Link to="/signup" className="text-trust font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
