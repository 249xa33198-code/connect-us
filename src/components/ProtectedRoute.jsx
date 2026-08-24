import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoadingBlock } from './Feedback'

/**
 * Wrap any route that requires login. Optionally restrict to specific roles.
 * Usage: <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, roles }) {
  const { currentUser, role, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingBlock label="Checking your session" />

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(role)) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center px-6">
        <p className="font-display text-3xl uppercase mb-2">Not authorized</p>
        <p className="text-ink-soft text-sm">
          Your account doesn’t have access to this page.
        </p>
      </div>
    )
  }

  return children
}
