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
          <i className="bi bi-camera pm-brand-icon"></i>
          <h1 className="pm-brand-title">PhotoMarket</h1>
        </div>

        <p className="pm-brand-subtitle">
          Accede a tu panel de gestión
        </p>

        {error && (
          <div className="pm-alert pm-alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              placeholder="Ingresa tu usuario"
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
          >
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <div className="pm-auth-footer">
          ¿No tienes una cuenta?{' '}

          <Link
            to="/register"
            className="pm-link"
          >
            Crear una cuenta
          </Link>
        </div>
      </section>
    </main>
  )
}