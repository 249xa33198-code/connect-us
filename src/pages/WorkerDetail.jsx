import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { LoadingBlock, ErrorBanner } from '../components/Feedback'
import Reveal from '../components/Reveal'

export default function WorkerDetail() {
  const { workerId } = useParams()
  const { currentUser, role } = useAuth()
  const navigate = useNavigate()

  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [form, setForm] = useState({ date: '', address: '', notes: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setLoadError(null)
      try {
        const snap = await getDoc(doc(db, 'workerProfiles', workerId))
        if (!cancelled) {
          if (snap.exists()) setWorker({ id: snap.id, ...snap.data() })
          else setLoadError('This worker profile no longer exists.')
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) setLoadError('Couldn\u2019t load this profile. Check your connection.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [workerId])

  function validate() {
    const errs = {}
    if (!form.date) errs.date = 'Pick a date.'
    else if (new Date(form.date) < new Date(new Date().toDateString())) errs.date = 'Date can\u2019t be in the past.'
    if (!form.address.trim()) errs.address = 'Enter the job address.'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleBook(e) {
    e.preventDefault()
    setSubmitError(null)

    if (!currentUser) {
      navigate('/login', { state: { from: { pathname: `/worker/${workerId}` } } })
      return
    }
    if (role !== 'employer') {
      setSubmitError('Only employer accounts can request bookings.')
      return
    }
    if (!validate()) return

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'bookings'), {
        employerId: currentUser.uid,
        workerId: worker.id,
        workerName: worker.name,
        date: form.date,
        address: form.address.trim(),
        notes: form.notes.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setSubmitError('Couldn\u2019t send the booking request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingBlock label="Loading profile" />
  if (loadError) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <ErrorBanner message={loadError} />
        <Link to="/browse" className="inline-block mt-4 text-trust text-sm hover:underline">← Back to search</Link>
      </div>
    )
  }

  return (
    <Reveal>
      <div className="max-w-3xl mx-auto px-6 py-12 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            {worker.photoUrl ? (
              <img src={worker.photoUrl} alt="" className="h-16 w-16 rounded-full object-cover border-2 border-line" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-paper-dim border-2 border-line flex items-center justify-center font-display text-2xl">
                {(worker.name || '?')[0]}
              </div>
            )}
            <div>
              <p className="font-display text-2xl uppercase leading-tight">{worker.name}</p>
              <p className="text-sm text-ink-soft">{worker.city}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(worker.skills || []).map((s) => (
              <span key={s} className="text-xs bg-paper-dim px-2 py-0.5 rounded font-medium">{s}</span>
            ))}
          </div>
          {worker.bio && <p className="text-sm text-ink-soft mb-4">{worker.bio}</p>}
          <div className="font-mono text-sm border-t border-dashed border-line pt-4">
            Day rate <span className="float-right font-semibold">₹{worker.dailyRate ?? '\u2014'}</span>
          </div>
        </div>

        <div className="md:col-span-3">
          {submitted ? (
            <div className="border-2 border-trust/40 bg-trust/5 text-trust px-5 py-6 rounded-lg text-center">
              <p className="font-display text-2xl uppercase mb-2">Request sent</p>
              <p className="text-sm">{worker.name} will accept or decline shortly. Track it in your bookings.</p>
              <Link to="/bookings" className="inline-block mt-4 font-mono text-xs uppercase underline">
                View bookings
              </Link>
            </div>
          ) : (
            <form onSubmit={handleBook} noValidate className="space-y-4 border-2 border-line rounded-lg p-6 bg-paper-dim">
              <p className="font-display text-xl uppercase mb-2">Request a booking</p>

              {submitError && <ErrorBanner message={submitError} />}

              <label className="block">
                <span className="block text-sm font-medium mb-1">Date needed</span>
                <input
                  type="date"
                  className={`w-full border-2 rounded-md px-3 py-2.5 bg-paper focus:outline-none ${fieldErrors.date ? 'border-danger' : 'border-line focus:border-ink'}`}
                  value={form.date}
                  onChange={(e) => { setForm((f) => ({ ...f, date: e.target.value })); setFieldErrors((er) => ({ ...er, date: null })) }}
                />
                {fieldErrors.date && <p className="text-xs text-danger mt-1">{fieldErrors.date}</p>}
              </label>

              <label className="block">
                <span className="block text-sm font-medium mb-1">Job address</span>
                <input
                  className={`w-full border-2 rounded-md px-3 py-2.5 bg-paper focus:outline-none ${fieldErrors.address ? 'border-danger' : 'border-line focus:border-ink'}`}
                  value={form.address}
                  onChange={(e) => { setForm((f) => ({ ...f, address: e.target.value })); setFieldErrors((er) => ({ ...er, address: null })) }}
                />
                {fieldErrors.address && <p className="text-xs text-danger mt-1">{fieldErrors.address}</p>}
              </label>

              <label className="block">
                <span className="block text-sm font-medium mb-1">Notes (optional)</span>
                <textarea
                  rows={3}
                  className="w-full border-2 border-line focus:border-ink rounded-md px-3 py-2.5 bg-paper focus:outline-none resize-none"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="What needs doing?"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-safety-dark text-paper font-mono text-sm uppercase tracking-wide py-3 rounded hover:bg-ink transition-colors disabled:opacity-50"
              >
                {submitting ? 'Sending\u2026' : 'Send booking request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </Reveal>
  )
}