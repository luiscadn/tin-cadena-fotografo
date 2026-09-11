// src/pages/AccessDenied.tsx

import { Link } from 'react-router-dom'

export const AccessDenied = () => {
  return (
    <main className="pm-auth-page">
      <section className="pm-auth-card">
        <div className="pm-brand">
          <i className="bi bi-camera pm-brand-icon"></i>
          <h1 className="pm-brand-title">PhotoMarket</h1>
        </div>

        <p className="pm-brand-subtitle">
          Acceso denegado
        </p>

        <div className="pm-alert pm-alert-error">
          No tienes permisos para acceder a esta sección.
        </div>

        <div
          style={{
            display: 'grid',
            gap: '0.75rem',
          }}
        >
          <Link
            to="/login"
            className="pm-btn pm-btn-outline pm-btn-full"
          >
            Ir al login
          </Link>

          <Link
            to="/dashboard"
            className="pm-btn pm-btn-primary pm-btn-full"
          >
            Ir al panel
          </Link>
        </div>
      </section>
    </main>
  )
}