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
            element={
              <Navigate
                to={isAuthenticated ? '/dashboard' : '/login'}
                replace
              />
            }
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
            element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            }
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
          <div className="fixed bottom-5 right-5 z-50 animate-bounce max-w-sm p-4 bg-gradient-to-r from-red-650 to-stone-900 text-white rounded-2xl border border-red-500/20 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔔</span>
              <p className="text-xs font-extrabold leading-snug text-left">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white hover:text-red-300 font-bold text-xl px-1.5 focus:outline-none"
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