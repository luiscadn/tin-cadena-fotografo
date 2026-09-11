// src/components/auth/ProtectedRoute.tsx

import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
}

export const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const {
    isAuthenticated,
    user,
    loading,
  } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0) {
    const hasRole = user.roles.some((role) =>
      allowedRoles.includes(role),
    )

    if (!hasRole) {
      return <Navigate to="/access-denied" replace />
    }
  }

  return <>{children}</>
}