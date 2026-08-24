import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { currentUser, profile, role, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/')
    } catch (err) {
      console.error(err)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="border-b-2 border-line bg-paper sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl uppercase tracking-wide flex items-center gap-2">
          <span className="text-safety-dark">■</span> LabWag
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/browse" className="hover:text-safety-dark transition-colors">
            Find workers
          </Link>

          {currentUser ? (
            <>
              {role === 'worker' && (
                <Link to="/my-profile" className="hover:text-safety-dark transition-colors">
                  My profile
                </Link>
              )}
              <Link to="/bookings" className="hover:text-safety-dark transition-colors">
                Bookings
              </Link>
              {role === 'admin' && (
                <Link to="/admin" className="hover:text-safety-dark transition-colors">
                  Admin
                </Link>
              )}
              <span className="text-ink-soft font-mono text-xs hidden sm:inline">
                {profile?.name || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="font-mono text-xs uppercase tracking-wide border-2 border-ink px-3 py-1.5 rounded hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
              >
                {loggingOut ? 'Logging out\u2026' : 'Log out'}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-safety-dark transition-colors">
                Log in
              </Link>
              <Link
                to="/signup"
                className="font-mono text-xs uppercase tracking-wide bg-safety-dark text-paper px-3 py-1.5 rounded hover:bg-ink transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}