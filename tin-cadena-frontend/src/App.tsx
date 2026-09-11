// src/App.tsx

import { useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { useAuth, useWebSocketNotifications } from './hooks'
import { AccessDenied } from './pages/AccessDenied'
import { Checkout } from './pages/Checkout'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { NotFound } from './pages/NotFound'
import { Register } from './pages/Register'
import { AdminDashboard } from './pages/AdminDashboard'
import { Explore } from './pages/Explore'
import { Favorites } from './pages/Favorites'
import { Purchases } from './pages/Purchases'
import { Users } from './pages/Users'
import { Roles } from './pages/Roles'
import { Home } from './pages/Home'

export const App = () => {
  const {
    isAuthenticated,
  } = useAuth()

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Register global Stomp WebSocket notification listener
  useWebSocketNotifications((msg) => {
    setToastMessage(msg)
    // Clear toast automatically after 6 seconds
    setTimeout(() => setToastMessage(null), 6000)
  })

  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || '/'}>
      <div className="relative min-h-screen flex flex-col justify-between">
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={
              isAuthenticated
                ? <Navigate to="/dashboard" replace />
                : <Login />
            }
          />

          <Route
            path="/register"
            element={
              isAuthenticated
                ? <Navigate to="/dashboard" replace />
                : <Register />
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/photographs"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PHOTOGRAPHER']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roles"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <Roles />
              </ProtectedRoute>
            }
          />

          <Route
            path="/explore"
            element={<Explore />}
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/purchases"
            element={
              <ProtectedRoute>
                <Purchases />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/access-denied"
            element={<AccessDenied />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>

        {/* Global STOMP Toast Notification Panel */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 max-w-sm p-4 bg-zinc-900/95 text-zinc-100 rounded-2xl border border-zinc-700/80 shadow-2xl flex items-center justify-between gap-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <i className="bi bi-bell-fill text-amber-400 text-lg flex-shrink-0"></i>
              <p className="text-xs font-semibold leading-snug text-left text-zinc-200">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-zinc-400 hover:text-white font-bold text-lg px-1.5 transition-colors focus:outline-none"
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </BrowserRouter>
  )
}

export default App