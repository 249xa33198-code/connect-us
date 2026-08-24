import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ErrorBanner } from '../components/Feedback'

const CITIES = ['Kurnool', 'Hyderabad', 'Bengaluru', 'Chennai', 'Other']

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    role: 'employer',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: 'Kurnool',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    setFieldErrors((e) => ({ ...e, [key]: null }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email.'
    if (form.password.length < 6) errs.password = 'Password needs at least 6 characters.'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords don\u2019t match.'
    if (form.phone && !/^[0-9+\-\s]{7,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number.'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return
    setSubmitting(true)
    try {
      await signup({
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
        role: form.role,
        city: form.city,
        phone: form.phone.trim(),
      })
      navigate(form.role === 'worker' ? '/my-profile' : '/browse')
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety-dark mb-2">Create account</p>
      <h1 className="font-display text-4xl uppercase mb-8">Get started</h1>

      {submitError && (
        <div className="mb-6">
          <ErrorBanner message={submitError} />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <fieldset className="flex gap-2" role="radiogroup" aria-label="Account type">
          {[
            { value: 'employer', label: 'I need to hire' },
            { value: 'worker', label: 'I offer work' },
          ].map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => update('role', opt.value)}
              aria-pressed={form.role === opt.value}
              className={`flex-1 border-2 rounded-md py-3 font-mono text-xs uppercase tracking-wide transition-colors ${
                form.role === opt.value
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line text-ink-soft hover:border-ink'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </fieldset>

        <Field label="Full name" error={fieldErrors.name}>
          <input
            className={inputClass(fieldErrors.name)}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            autoComplete="name"
          />
        </Field>

        <Field label="Email" error={fieldErrors.email}>
          <input
            type="email"
            className={inputClass(fieldErrors.email)}
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            autoComplete="email"
          />
        </Field>

        <Field label="Phone (optional)" error={fieldErrors.phone}>
          <input
            className={inputClass(fieldErrors.phone)}
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            autoComplete="tel"
          />
        </Field>

        <Field label="City">
          <select
            className={inputClass()}
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Password" error={fieldErrors.password}>
          <input
            type="password"
            className={inputClass(fieldErrors.password)}
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            autoComplete="new-password"
          />
        </Field>

        <Field label="Confirm password" error={fieldErrors.confirmPassword}>
          <input
            type="password"
            className={inputClass(fieldErrors.confirmPassword)}
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            autoComplete="new-password"
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-safety-dark text-paper font-mono text-sm uppercase tracking-wide py-3 rounded hover:bg-ink transition-colors disabled:opacity-50"
        >
          {submitting ? 'Creating account\u2026' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-trust font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">{label}</span>
      {children}
      {error && <span className="block text-xs text-danger mt-1">{error}</span>}
    </label>
  )
}

function inputClass(error) {
  return `w-full border-2 rounded-md px-3 py-2.5 bg-white focus:outline-none transition-colors ${
    error ? 'border-danger' : 'border-line focus:border-ink'
  }`
}
