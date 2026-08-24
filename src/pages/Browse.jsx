import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, query } from 'firebase/firestore'
import { Link, useSearchParams } from 'react-router-dom'
import { db } from '../firebase'
import { LoadingBlock, ErrorBanner, EmptyState } from '../components/Feedback'
import Reveal from '../components/Reveal'

const SKILLS = ['Electrician', 'Mason', 'Painter', 'Plumber', 'Mover', 'Carpenter', 'Welder', 'Gardener']

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams()
  const skillFilter = searchParams.get('skill') || ''
  const [cityFilter, setCityFilter] = useState('')

  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const snap = await getDocs(query(collection(db, 'workerProfiles')))
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setWorkers(all)
    } catch (err) {
      console.error(err)
      setError('Couldn\u2019t load workers right now. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    return workers.filter((w) => {
      if (skillFilter && !(w.skills || []).includes(skillFilter)) return false
      if (cityFilter && (w.city || '').toLowerCase() !== cityFilter.toLowerCase()) return false
      return true
    })
  }, [workers, skillFilter, cityFilter])

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety-dark mb-2">Directory</p>
      <h1 className="font-display text-4xl uppercase mb-8">Find a worker</h1>

      <div className="flex flex-wrap gap-3 mb-10">
        <select
          value={skillFilter}
          onChange={(e) => setSearchParams(e.target.value ? { skill: e.target.value } : {})}
          className="border-2 border-line rounded-md px-3 py-2 bg-paper-dim text-sm focus:outline-none focus:border-ink"
        >
          <option value="">All trades</option>
          {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          placeholder="City"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border-2 border-line rounded-md px-3 py-2 bg-paper-dim text-sm focus:outline-none focus:border-ink"
        />
      </div>

      {loading && <LoadingBlock label="Loading workers" />}
      {!loading && error && <ErrorBanner message={error} onRetry={load} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          title="No matches"
          body="Try a different trade or clear the city filter."
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((w, i) => (
            <Reveal key={w.id} delay={(i % 6) * 60}>
              <Link
                to={`/worker/${w.id}`}
                className="ticket-edge block bg-paper-dim border-2 border-ink rounded-lg p-5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-ink)] transition-all h-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {w.photoUrl ? (
                      <img src={w.photoUrl} alt="" className="h-12 w-12 rounded-full object-cover border-2 border-line" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-paper border-2 border-line flex items-center justify-center font-display text-lg">
                        {(w.name || '?')[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-display text-xl uppercase leading-tight">{w.name || 'Worker'}</p>
                      <p className="text-xs text-ink-soft">{w.city || 'City not set'}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-mono uppercase px-2 py-1 rounded ${w.availability === 'available' ? 'bg-trust/10 text-trust' : 'bg-ink/5 text-ink-soft'}`}>
                    {w.availability === 'available' ? 'Free' : 'Busy'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(w.skills || []).map((s) => (
                    <span key={s} className="text-xs bg-paper px-2 py-0.5 rounded font-medium">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-line pt-3">
                  <span className="text-xs text-ink-soft font-mono">Day rate</span>
                  <span className="font-mono font-semibold">₹{w.dailyRate ?? '\u2014'}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}