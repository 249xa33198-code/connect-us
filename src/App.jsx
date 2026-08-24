import { Routes, Route } from 'react-router-dom'
import { isFirebaseConfigured } from './firebase'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Browse from './pages/Browse'
import WorkerDetail from './pages/WorkerDetail'
import MyProfile from './pages/MyProfile'
import Bookings from './pages/Bookings'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import SetupNeeded from './pages/SetupNeeded'

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/worker/:workerId" element={<WorkerDetail />} />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute roles={['worker']}>
                <MyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute roles={['worker', 'employer', 'admin']}>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  if (!isFirebaseConfigured) {
    return <SetupNeeded />
  }
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
