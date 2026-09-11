// src/components/auth/LoginForm.tsx

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks'
import type { LoginPayload } from '../../services/auth.service'

export const LoginForm = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()

  const [formData, setFormData] = useState<LoginPayload>({
    username: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    try {
      await login(formData)
      navigate('/dashboard')
    } catch (loginError) {
      console.error('Error al iniciar sesión:', loginError)
    }
  }

  return (
    <main className="pm-auth-page">
      <section className="pm-auth-card">
        <div className="pm-brand">
          <i className="bi bi-camera2 pm-brand-icon"></i>
          <h1 className="pm-brand-title">TIN CADENA</h1>
          <p className="pm-brand-subtitle">
            FINE ART PHOTOGRAPHY · MIAMI
          </p>
        </div>

        {error && (
          <div className="pm-alert pm-alert-error">
            <i className="bi bi-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="pm-form-group">
            <label
              htmlFor="username"
              className="pm-form-label"
            >
              Usuario
            </label>

            <input
              id="username"
              name="username"
              type="text"
              className="pm-form-control"
              placeholder="Ingresa tu nombre de usuario"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="pm-form-group">
            <label
              htmlFor="password"
              className="pm-form-label"
            >
              Contraseña
            </label>

            <div className="pm-password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="pm-form-control"
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <button
                type="button"
                className="pm-password-button"
                onClick={() =>
                  setShowPassword((currentValue) => !currentValue)
                }
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="pm-btn pm-btn-primary pm-btn-full"
            disabled={loading}
            style={{ marginTop: '1.25rem' }}
          >
            {loading ? 'Accediendo...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="pm-auth-footer">
          ¿No tienes una cuenta?{' '}
          <Link
            to="/register"
            className="pm-link"
          >
            Crear Cuenta
          </Link>
        </div>
      </section>
    </main>
  )
}

export default LoginForm