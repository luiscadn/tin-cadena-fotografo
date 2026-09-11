// src/pages/AccessDenied.tsx

import { Link } from 'react-router-dom'

export const AccessDenied = () => {
  return (
    <main className="pm-auth-page">
      <section className="pm-auth-card">
        <div className="pm-brand">
          <i className="bi bi-shield-x pm-brand-icon text-rose-400"></i>
          <h1 className="pm-brand-title">TIN CADENA</h1>
          <p className="pm-brand-subtitle">
            FINE ART PHOTOGRAPHY · MIAMI
          </p>
        </div>

        <div className="pm-alert pm-alert-error mb-6">
          <i className="bi bi-exclamation-octagon-fill"></i>
          <span>No posee los privilegios necesarios para acceder a esta sección de la galería.</span>
        </div>

        <div className="grid gap-3">
          <Link
            to="/dashboard"
            className="pm-btn pm-btn-primary pm-btn-full"
          >
            Ir al Panel Principal
          </Link>

          <Link
            to="/login"
            className="pm-btn pm-btn-outline pm-btn-full"
          >
            Iniciar con otra cuenta
          </Link>
        </div>
      </section>
    </main>
  )
}