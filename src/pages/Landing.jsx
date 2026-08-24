import { Link } from 'react-router-dom'
import { useState } from 'react'
import StatusStamp from '../components/StatusStamp'
import Reveal from '../components/Reveal'

const TRADES = [
  { name: 'Electrician', note: 'Wiring, fault repair, installs' },
  { name: 'Mason', note: 'Brickwork, plastering, tiling' },
  { name: 'Painter', note: 'Interior, exterior, touch-ups' },
  { name: 'Plumber', note: 'Leaks, fittings, drainage' },
  { name: 'Mover', note: 'Loading, transport, heavy lifting' },
  { name: 'Carpenter', note: 'Furniture, fittings, repairs' },
]

const PROBLEMS = [
  {
    title: 'Hours lost waiting',
    body: 'Workers show up at a labour chowk with no guarantee anyone needs their trade that day.',
  },
  {
    title: 'Dozens of calls per job',
    body: 'Contractors work their phone book contact by contact just to fill one day\u2019s requirement.',
  },
  {
    title: 'No record of who\u2019s reliable',
    body: 'Trust is word-of-mouth. There\u2019s no way to see a worker\u2019s history before hiring them.',
  },
]

const SOLUTION = [
  {
    title: 'Search & filter, instantly',
    body: 'Browse verified worker profiles by trade and city. No calls, no waiting \u2014 see who\u2019s free right now.',
  },
  {
    title: 'Direct booking requests',
    body: 'Send the date, address, and job details straight to the worker. It lands in their Bookings tab immediately.',
  },
  {
    title: 'Clear accept or decline',
    body: 'Every request gets a stamped status \u2014 pending, accepted, or declined. No one\u2019s left guessing.',
  },
  {
    title: 'Admin oversight built in',
    body: 'Every user, listing, and booking is visible in one dashboard, so bad actors can be removed fast.',
  },
]

const WORKER_STEPS = [
  { num: '01', title: 'List your skills', body: 'Add your trade, day rate, and availability once.' },
  { num: '02', title: 'Get found', body: 'Employers search by trade and city \u2014 your profile shows up instantly.' },
  { num: '03', title: 'Accept or decline', body: 'See the job, date, and address before you commit. One tap either way.' },
]

const EMPLOYER_STEPS = [
  { num: '01', title: 'Search by trade', body: 'Filter workers by skill and city to find who\u2019s free today.' },
  { num: '02', title: 'Request the booking', body: 'Send the date, address and job details. No back-and-forth calls.' },
  { num: '03', title: 'Get a stamped answer', body: 'The worker accepts or declines \u2014 you always know where you stand.' },
]

export default function Landing() {
  const [audience, setAudience] = useState('employer')
  const steps = audience === 'employer' ? EMPLOYER_STEPS : WORKER_STEPS

  return (
    <div className="overflow-hidden">
      {/* Hero — not wrapped in Reveal since it's above the fold and should show immediately */}
      <section className="relative">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(var(--color-line) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety-dark mb-4">
              Hire today. Get paid today.
            </p>
            <h1 className="font-display text-6xl md:text-7xl uppercase leading-[0.92] mb-6">
              Skilled hands,
              <br />
              booked by <span className="text-site-orange">tonight.</span>
            </h1>
            <p className="text-ink-soft text-lg max-w-md mb-8">
              LabWag puts verified electricians, masons, painters and movers a search
              away — no agencies, no waiting rooms. Post the job, get a stamped confirmation.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                to="/browse"
                className="bg-ink text-paper font-mono text-sm uppercase tracking-wide px-6 py-3 rounded hover:bg-site-orange transition-colors"
              >
                Find a worker
              </Link>
              <Link
                to="/signup"
                className="border-2 border-ink font-mono text-sm uppercase tracking-wide px-6 py-3 rounded hover:bg-ink hover:text-paper transition-colors"
              >
                List your skills
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-wide text-ink-soft border-t border-dashed border-line pt-5">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-trust" />
                Verified profiles
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-safety-dark" />
                Same-day requests
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-site-orange" />
                No agency fees
              </span>
            </div>
          </div>

          {/* Phone mockup showing the actual booking flow */}
          <div className="relative flex justify-center md:justify-end">
            <div className="w-[280px] bg-ink rounded-[2.2rem] p-3 shadow-[10px_10px_0_0_var(--color-line)]">
              <div className="bg-paper rounded-[1.6rem] overflow-hidden">
                <div className="flex items-center justify-between px-5 pt-3 pb-1 font-mono text-[10px] text-ink-soft">
                  <span>9:41</span>
                  <span>LabWag</span>
                </div>

                <div className="p-4 pb-10 space-y-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-safety-dark px-1">
                    Booking request
                  </p>
                  <div className="ticket-edge bg-paper-dim border-2 border-ink rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3 font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                      <span>Order #0417</span>
                      <StatusStamp status="accepted" />
                    </div>
                    <p className="font-display text-lg uppercase leading-tight mb-1">Ramesh K.</p>
                    <p className="text-xs text-ink-soft mb-3">Electrician · Kurnool</p>
                    <div className="flex items-center justify-between border-t border-dashed border-line pt-3 text-xs">
                      <span className="text-ink-soft font-mono">Day rate</span>
                      <span className="font-mono font-semibold">₹900</span>
                    </div>
                  </div>
                  <div className="bg-trust/10 border border-trust/30 rounded-lg px-4 py-3 text-xs text-trust font-medium">
                    Request sent — Ramesh will accept or decline shortly.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <Reveal>
        <section className="bg-paper-dim border-y-2 border-line py-20">
          <div className="max-w-6xl mx-auto px-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety-dark mb-3">The problem</p>
            <h2 className="font-display text-4xl md:text-5xl uppercase mb-12 max-w-2xl leading-[0.95]">
              Finding work — and finding workers — still runs on luck.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {PROBLEMS.map((p, i) => (
                <Reveal key={p.title} delay={i * 120}>
                  <div className="bg-paper border-2 border-ink rounded-lg p-6 h-full">
                    <h3 className="font-display text-xl uppercase mb-2">{p.title}</h3>
                    <p className="text-sm text-ink-soft">{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Solution — alternating showcase rows with real feature mockups */}
      <Reveal>
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety-dark mb-3">The solution</p>
            <h2 className="font-display text-4xl md:text-5xl uppercase mb-16 max-w-2xl leading-[0.95]">
              One platform, built for how the trades actually work.
            </h2>

            {/* Row 1: Search & filter — mockup of the actual Browse page */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-safety/15 text-safety-dark font-display text-2xl mb-5">01</span>
                <h3 className="font-display text-3xl uppercase mb-3">Search & filter, instantly</h3>
                <p className="text-ink-soft max-w-sm">
                  Browse verified worker profiles by trade and city. No calls, no waiting —
                  see who's free right now and what they charge, before you reach out.
                </p>
              </div>
              <div className="bg-paper-dim border-2 border-ink rounded-xl p-4 shadow-[8px_8px_0_0_var(--color-line)]">
                <div className="flex gap-2 mb-3">
                  <span className="text-xs font-mono border-2 border-line rounded px-2 py-1 bg-paper">Electrician</span>
                  <span className="text-xs font-mono border-2 border-line rounded px-2 py-1 bg-paper text-ink-soft">City</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Ramesh K.', city: 'Kurnool', rate: 900 },
                    { name: 'Suresh P.', city: 'Kurnool', rate: 750 },
                  ].map((w) => (
                    <div key={w.name} className="flex items-center justify-between bg-paper border-2 border-line rounded-lg px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-paper-dim border-2 border-line flex items-center justify-center font-display text-sm">
                          {w.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-tight">{w.name}</p>
                          <p className="text-xs text-ink-soft">{w.city}</p>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-semibold">₹{w.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Direct booking */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div className="bg-paper-dim border-2 border-ink rounded-xl p-5 shadow-[8px_8px_0_0_var(--color-line)] md:order-1 order-2">
                <div className="ticket-edge bg-paper border-2 border-ink rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3 font-mono text-xs uppercase text-ink-soft">
                    <span>Order #0417</span>
                    <StatusStamp status="pending" />
                  </div>
                  <p className="font-display text-lg uppercase mb-3">Wiring repair — Kurnool</p>
                  <div className="flex gap-2">
                    <span className="flex-1 text-center font-mono text-xs uppercase border-2 border-danger text-danger rounded px-3 py-2">Decline</span>
                    <span className="flex-1 text-center font-mono text-xs uppercase border-2 border-trust text-trust rounded px-3 py-2">Accept</span>
                  </div>
                </div>
              </div>
              <div className="md:order-2 order-1">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-trust/15 text-trust font-display text-2xl mb-5">02</span>
                <h3 className="font-display text-3xl uppercase mb-3">Direct booking requests</h3>
                <p className="text-ink-soft max-w-sm">
                  Send the date, address, and job details straight to the worker. It lands in
                  their Bookings tab immediately — they accept or decline with one tap.
                </p>
              </div>
            </div>

            {/* Row 3: Admin oversight — mockup of the real admin panel */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-site-orange/15 text-site-orange font-display text-2xl mb-5">03</span>
                <h3 className="font-display text-3xl uppercase mb-3">Admin oversight built in</h3>
                <p className="text-ink-soft max-w-sm">
                  Every user, listing, and booking is visible in one dashboard — so bad actors
                  or bad listings can be spotted and removed fast.
                </p>
              </div>
              <div className="bg-paper-dim border-2 border-ink rounded-xl p-4 shadow-[8px_8px_0_0_var(--color-line)]">
                <div className="flex gap-1 mb-3 font-mono text-[11px] uppercase">
                  <span className="border-b-2 border-safety-dark px-3 py-1.5">Users</span>
                  <span className="text-ink-soft px-3 py-1.5">Worker profiles</span>
                  <span className="text-ink-soft px-3 py-1.5">Bookings</span>
                </div>
                <div className="border-2 border-line rounded-lg overflow-hidden bg-paper">
                  <div className="bg-paper-dim px-3 py-2 font-mono text-[10px] uppercase text-ink-soft grid grid-cols-3">
                    <span>Name</span><span>Role</span><span>City</span>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="px-3 py-2.5 grid grid-cols-3 border-t border-line items-center">
                      <span className="h-2.5 w-16 bg-line rounded-full" />
                      <span className="h-2.5 w-12 bg-line rounded-full" />
                      <span className="h-2.5 w-14 bg-line rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Trades grid */}
      <Reveal>
        <section className="bg-ink text-paper py-16">
          <div className="max-w-6xl mx-auto px-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety mb-8">Trades on the platform</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TRADES.map((t) => (
                <Link
                  key={t.name}
                  to={`/browse?skill=${encodeURIComponent(t.name)}`}
                  className="group border border-paper/20 rounded-lg px-5 py-4 hover:border-safety hover:bg-paper/5 transition-colors"
                >
                  <p className="font-display text-2xl uppercase tracking-wide mb-1 group-hover:text-safety transition-colors">
                    {t.name}
                  </p>
                  <p className="text-sm text-paper/60">{t.note}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* How it works — split by audience */}
      <Reveal>
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety-dark">How it works</p>
            <div className="flex border-2 border-ink rounded-full overflow-hidden font-mono text-xs uppercase tracking-wide">
              <button
                onClick={() => setAudience('employer')}
                className={`px-4 py-2 transition-colors ${audience === 'employer' ? 'bg-ink text-paper' : 'text-ink hover:bg-paper-dim'}`}
              >
                For employers
              </button>
              <button
                onClick={() => setAudience('worker')}
                className={`px-4 py-2 transition-colors ${audience === 'worker' ? 'bg-ink text-paper' : 'text-ink hover:bg-paper-dim'}`}
              >
                For workers
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-0 border-2 border-ink rounded-lg overflow-hidden">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`relative p-8 ${i < steps.length - 1 ? 'md:border-r-2 border-dashed border-ink/30' : ''} ${i % 2 ? 'bg-paper-dim' : ''}`}
              >
                <span className="font-mono text-xs text-safety-dark tracking-widest">{step.num}</span>
                <h3 className="font-display text-2xl uppercase mt-2 mb-2">{step.title}</h3>
                <p className="text-ink-soft text-sm">{step.body}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Closing CTA — full-bleed accent block with pill CTA */}
      <Reveal>
        <section className="bg-site-orange text-ink">
          <div className="max-w-4xl mx-auto px-6 py-24 text-center">
            <h2 className="font-display text-5xl md:text-6xl uppercase leading-[0.95] mb-6">
              Ready to get the job done?
            </h2>
            <p className="text-ink/70 text-lg mb-10">
              Join workers and employers already using LabWag.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-ink text-paper font-mono text-sm uppercase tracking-wide px-8 py-4 rounded-full hover:bg-paper hover:text-ink transition-colors"
            >
              Get started free →
            </Link>
          </div>
        </section>
      </Reveal>

      {/* Footer — multi-column, matching real pages only */}
      <footer className="bg-site-orange text-ink border-t border-ink/15">
        <div className="max-w-6xl mx-auto px-6 py-14 grid sm:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-3 w-3 bg-ink" />
              <span className="font-display text-lg uppercase tracking-wide">LabWag</span>
            </div>
            <p className="text-sm text-ink/70 max-w-xs">
              Connecting skilled trades workers with employers — no agencies, no middlemen.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest mb-4 text-ink/80">Platform</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="hover:underline">Find workers</Link></li>
              <li><Link to="/signup" className="hover:underline">List your skills</Link></li>
              <li><Link to="/bookings" className="hover:underline">Bookings</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest mb-4 text-ink/80">Account</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:underline">Log in</Link></li>
              <li><Link to="/signup" className="hover:underline">Sign up</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}