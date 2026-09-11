// src/components/auth/RegisterForm.tsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import api from '@services/api'
import { ENDPOINTS } from '@utils/constants'
import type { RegisterPayload } from '@services/auth.service'

export const RegisterForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RegisterPayload>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      }
      await api.post(ENDPOINTS.AUTH.REGISTER, payload)
      navigate('/login')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const serverMessage =
          err.response?.data?.message || err.response?.data?.error
        setError(
          typeof serverMessage === 'string'
            ? serverMessage
            : 'Error en el registro. Verifica los datos ingresados.',
        )
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error en el registro. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
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
          <div className="grid grid-cols-2 gap-3">
            <div className="pm-form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="firstName" className="pm-form-label">
                Nombre
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className="pm-form-control"
                placeholder="Nombre"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="pm-form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="lastName" className="pm-form-label">
                Apellido
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="pm-form-control"
                placeholder="Apellido"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="pm-form-group">
            <label htmlFor="username" className="pm-form-label">
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="pm-form-control"
              placeholder="Elige un nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="pm-form-group">
            <label htmlFor="email" className="pm-form-label">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="pm-form-control"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="pm-form-group">
            <label htmlFor="password" className="pm-form-label">
              Contraseña
            </label>
            <div className="pm-password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="pm-form-control"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="pm-password-button"
                onClick={() => setShowPassword((prev) => !prev)}
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
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="pm-auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="pm-link">
            Iniciar Sesión
          </Link>
        </div>
      </section>
    </main>
  )
}

export default RegisterForm