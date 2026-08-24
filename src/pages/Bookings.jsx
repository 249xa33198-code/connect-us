import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import StatusStamp from '../components/StatusStamp'
import { LoadingBlock, ErrorBanner, EmptyState } from '../components/Feedback'
import Reveal from '../components/Reveal'

export default function Bookings() {
  const { currentUser, role } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actioningId, setActioningId] = useState(null)
  const [actionError, setActionError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const field = role === 'worker' ? 'workerId' : 'employerId'
      const q = query(collection(db, 'bookings'), where(field, '==', currentUser.uid), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error(err)
      setError('Couldn\u2019t load your bookings. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser && role) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, role])

  async function respond(bookingId, status) {
    setActioningId(bookingId)
    setActionError(null)
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status })
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)))
    } catch (err) {
      console.error(err)
      setActionError('Couldn\u2019t update that booking. Try again.')
    } finally {
      setActioningId(null)
    }
  }

  if (loading) return <LoadingBlock label="Loading bookings" />

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety-dark mb-2">
        {role === 'worker' ? 'Requests received' : 'Your requests'}
      </p>
      <h1 className="font-display text-4xl uppercase mb-8">Bookings</h1>

      {error && <div className="mb-6"><ErrorBanner message={error} onRetry={load} /></div>}
      {actionError && <div className="mb-6"><ErrorBanner message={actionError} /></div>}

      {!error && bookings.length === 0 && (
        <EmptyState
          title="Nothing here yet"
          body={role === 'worker' ? 'Booking requests from employers will show up here.' : 'Requests you send to workers will show up here.'}
        />
      )}

      <div className="space-y-4">
        {bookings.map((b, i) => (
          <Reveal key={b.id} delay={(i % 8) * 50}>
            <div className="ticket-edge bg-paper-dim border-2 border-ink rounded-lg p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-display text-xl uppercase leading-tight">
                    {role === 'worker' ? `Job on ${b.date}` : b.workerName}
                  </p>
                  <p className="text-sm text-ink-soft">{b.address}</p>
                </div>
                <StatusStamp status={b.status} />
              </div>
              {b.notes && <p className="text-sm text-ink-soft mb-3 border-t border-dashed border-line pt-3">{b.notes}</p>}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-ink-soft">Date: {b.date}</span>
                {role === 'worker' && b.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => respond(b.id, 'rejected')}
                      disabled={actioningId === b.id}
                      className="font-mono text-xs uppercase border-2 border-danger text-danger px-3 py-1.5 rounded hover:bg-danger hover:text-paper transition-colors disabled:opacity-50"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => respond(b.id, 'accepted')}
                      disabled={actioningId === b.id}
                      className="font-mono text-xs uppercase border-2 border-trust text-trust px-3 py-1.5 rounded hover:bg-trust hover:text-paper transition-colors disabled:opacity-50"
                    >
                      Accept
                    </button>
                  </div>
                )}
                {role === 'worker' && b.status === 'accepted' && (
                  <button
                    onClick={() => respond(b.id, 'completed')}
                    disabled={actioningId === b.id}
                    className="font-mono text-xs uppercase border-2 border-ink px-3 py-1.5 rounded hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
                  >
                    Mark completed
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}