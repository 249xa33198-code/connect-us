import { useEffect, useState } from 'react'
import { collection, getDocs, doc, deleteDoc, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import StatusStamp from '../components/StatusStamp'
import { LoadingBlock, ErrorBanner, EmptyState } from '../components/Feedback'
import Reveal from '../components/Reveal'

const TABS = ['Users', 'Worker profiles', 'Bookings']

export default function AdminDashboard() {
  const [tab, setTab] = useState('Users')
  const [users, setUsers] = useState([])
  const [workers, setWorkers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  async function loadAll() {
    setLoading(true)
    setError(null)
    try {
      const [usersSnap, workersSnap, bookingsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'workerProfiles')),
        getDocs(query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))),
      ])
      setUsers(usersSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setWorkers(workersSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setBookings(bookingsSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error(err)
      setError('Couldn\u2019t load admin data. Check your connection and Firestore rules.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  async function removeWorkerProfile(id) {
    if (!confirm('Remove this worker listing? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteDoc(doc(db, 'workerProfiles', id))
      setWorkers((prev) => prev.filter((w) => w.id !== id))
    } catch (err) {
      console.error(err)
      alert('Couldn\u2019t remove this listing. Try again.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <LoadingBlock label="Loading admin data" />

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety-dark mb-2">Admin</p>
      <h1 className="font-display text-4xl uppercase mb-8">Control panel</h1>

      {error && <div className="mb-6"><ErrorBanner message={error} onRetry={loadAll} /></div>}

      <div className="flex gap-2 mb-8 border-b-2 border-line">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-xs uppercase tracking-wide px-4 py-2.5 -mb-0.5 border-b-2 transition-colors ${
              tab === t ? 'border-safety-dark text-ink' : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            {t} <span className="opacity-60">({t === 'Users' ? users.length : t === 'Worker profiles' ? workers.length : bookings.length})</span>
          </button>
        ))}
      </div>

      <Reveal key={tab}>
        {tab === 'Users' && (
          users.length === 0 ? <EmptyState title="No users yet" /> : (
            <div className="border-2 border-line rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-paper-dim font-mono text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-4 py-2.5">Name</th>
                    <th className="text-left px-4 py-2.5">Email</th>
                    <th className="text-left px-4 py-2.5">Role</th>
                    <th className="text-left px-4 py-2.5">City</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-line">
                      <td className="px-4 py-2.5">{u.name}</td>
                      <td className="px-4 py-2.5 font-mono text-xs">{u.email}</td>
                      <td className="px-4 py-2.5 capitalize">{u.role}</td>
                      <td className="px-4 py-2.5">{u.city || '\u2014'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {tab === 'Worker profiles' && (
          workers.length === 0 ? <EmptyState title="No worker listings yet" /> : (
            <div className="space-y-3">
              {workers.map((w) => (
                <div key={w.id} className="flex items-center justify-between border-2 border-line rounded-lg px-4 py-3 bg-paper-dim">
                  <div>
                    <p className="font-medium">{w.name} <span className="text-ink-soft font-normal">· {w.city}</span></p>
                    <p className="text-xs text-ink-soft">{(w.skills || []).join(', ')} · ₹{w.dailyRate}/day</p>
                  </div>
                  <button
                    onClick={() => removeWorkerProfile(w.id)}
                    disabled={deletingId === w.id}
                    className="font-mono text-xs uppercase border-2 border-danger text-danger px-3 py-1.5 rounded hover:bg-danger hover:text-paper transition-colors disabled:opacity-50"
                  >
                    {deletingId === w.id ? 'Removing\u2026' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'Bookings' && (
          bookings.length === 0 ? <EmptyState title="No bookings yet" /> : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between border-2 border-line rounded-lg px-4 py-3 bg-paper-dim">
                  <div>
                    <p className="font-medium">{b.workerName} <span className="text-ink-soft font-normal">· {b.date}</span></p>
                    <p className="text-xs text-ink-soft">{b.address}</p>
                  </div>
                  <StatusStamp status={b.status} />
                </div>
              ))}
            </div>
          )
        )}
      </Reveal>
    </div>
  )
}