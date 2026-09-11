// src/components/PhotographForm.tsx

import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { ENDPOINTS } from '../utils/constants'
import { useAuth } from '../hooks'
import type { Photo } from '../types'

interface Category {
  id: number
  name: string
  description?: string
}

interface Photographer {
  id: number
  userId: number
  bio?: string
  website?: string
  phone?: string
}

interface UserDetails {
  id: number
  username: string
  email: string
}

interface PhotographFormProps {
  photo?: Photo // If present, we are editing
  onSubmitSuccess: () => void
  onCancel: () => void
}

const parseDescription = (desc: string = '') => {
  const storyMatch = desc.match(/===STORY===([\s\S]*?)(===LOCATION===|===TECHNICAL===|$)/i)
  const locationMatch = desc.match(/===LOCATION===([\s\S]*?)(===TECHNICAL===|$)/i)
  const techMatch = desc.match(/===TECHNICAL===([\s\S]*?)$/i)

  return {
    story: storyMatch ? storyMatch[1].trim() : desc.trim(),
    location: locationMatch ? locationMatch[1].trim() : 'No especificada (Obra Clásica)',
    tech: techMatch ? techMatch[1].trim() : 'No especificado (Configuración Clásica)',
  }
}

const formatDescription = (story: string, location: string, tech: string): string => {
  return `===STORY===\n${story.trim()}\n===LOCATION===\n${location.trim()}\n===TECHNICAL===\n${tech.trim()}`
}

export const PhotographForm = ({
  photo,
  onSubmitSuccess,
  onCancel,
}: PhotographFormProps) => {
  const { user } = useAuth()

  // Form states
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [edition, setEdition] = useState<number | ''>('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [imageUrl, setImageUrl] = useState('')
  
  // Specific required subfields
  const [story, setStory] = useState('')
  const [location, setLocation] = useState('')
  const [tech, setTech] = useState('')

  // System states
  const [categories, setCategories] = useState<Category[]>([])
  const [photographerId, setPhotographerId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Fetch categories and resolve photographer ID
  useEffect(() => {
    const loadFormData = async () => {
      try {
        setLoading(true)
        // Fetch categories
        const catRes = await api.get<Category[]>(`/v1/categories`)
        setCategories(catRes.data)

        if (photo) {
          // Editing mode: populate fields
          setTitle(photo.title)
          setPrice(photo.price)
          setEdition(photo.edition)
          setCategoryId(photo.categoryId)
          setImageUrl(photo.image || '')
          
          const parsed = parseDescription(photo.description)
          setStory(parsed.story)
          setLocation(parsed.location)
          setTech(parsed.tech)
          setPhotographerId(photo.photographerId)
        } else if (user) {
          // Creation mode: Resolve photographer ID
          // 1. Fetch current user from /api/users to find ID
          const usersRes = await api.get<UserDetails[]>(`/users`)
          const currentUserObj = usersRes.data.find(
            (u) => u.username === user.username
          )
          
          if (currentUserObj) {
            const userId = currentUserObj.id
            // 2. Fetch photographer
            const photographersRes = await api.get<Photographer[]>(`/v1/photographers`)
            const currentPhotographer = photographersRes.data.find(
              (p) => p.userId === userId
            )
            if (currentPhotographer) {
              setPhotographerId(currentPhotographer.id)
            } else {
              // Fallback: Create photographer profile if it doesn't exist
              const newPhotoRes = await api.post<Photographer>(`/v1/photographers`, {
                userId,
                bio: 'Fotógrafo Fine Art',
                website: '',
                phone: '',
              })
              setPhotographerId(newPhotoRes.data.id)
            }
          }
        }
      } catch (err) {
        const errorVal = err as { response?: unknown }
        console.error("Error cargando categorías:", errorVal.response || err)
        setError('No fue posible inicializar el formulario.')
      } finally {
        setLoading(false)
      }
    }

    loadFormData()
  }, [photo, user])

  const validate = (): boolean => {
    const errors: Record<string, string> = {}

    if (!title.trim()) errors.title = 'El título es requerido'
    if (price === '' || price <= 0) errors.price = 'El precio debe ser un número positivo'
    if (edition === '' || edition <= 0) errors.edition = 'La edición debe ser un entero positivo'
    if (!categoryId) errors.categoryId = 'Debe seleccionar una categoría'
    if (!story.trim()) errors.story = 'La historia detrás de la captura es obligatoria'
    if (!location.trim()) errors.location = 'La ubicación geográfica es obligatoria'
    if (!tech.trim()) errors.tech = 'Los parámetros técnicos de cámara son obligatorios'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    if (photographerId === null) {
      setError('No se pudo identificar su perfil de fotógrafo para registrar la obra.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const formattedDescription = formatDescription(story, location, tech)
      const payload = {
        title,
        description: formattedDescription,
        price: Number(price),
        edition: Number(edition),
        status: photo ? photo.status : 'AVAILABLE',
        photographerId,
        categoryId: Number(categoryId),
        // If imageUrl is empty, use a nice fine art mockup background
        image: imageUrl.trim() || 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&auto=format&fit=crop&q=80',
      }

      if (photo) {
        // Edit mode
        await api.put(ENDPOINTS.PHOTOS.BY_ID(photo.id), payload)
      } else {
        // Create mode
        await api.post(ENDPOINTS.PHOTOS.BASE, payload)
      }

      onSubmitSuccess()
    } catch (err) {
      console.error('Error submitting photograph:', err)
      setError('Ocurrió un error al guardar la obra de arte.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center py-12 text-amber-700">
        <span className="loading loading-spinner loading-lg mr-2"></span>
        Cargando formulario y configuraciones...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl text-zinc-100 backdrop-blur-md max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-white border-b border-zinc-800/80 pb-4 mb-6 tracking-tight">
        {photo ? 'Editar Obra de Arte' : 'Registrar Nueva Obra de Arte'}
      </h3>

      {error && (
        <div className="pm-alert pm-alert-error mb-6 p-4 rounded-xl border border-rose-800/50 bg-rose-950/40 text-rose-300 flex items-center gap-2 text-sm font-medium">
          <i className="bi bi-exclamation-triangle-fill text-rose-400"></i>
          {error}
        </div>
      )}

      {/* Grid General */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Título */}
        <div className="pm-form-group md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Título de la Obra *
          </label>
          <input
            type="text"
            className={`w-full p-3 border rounded-xl bg-zinc-950/80 text-zinc-100 focus:border-zinc-400 outline-none text-sm transition-all ${
              validationErrors.title ? 'border-rose-500' : 'border-zinc-800'
            }`}
            placeholder="Ej. Murmullos del Silencio"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {validationErrors.title && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{validationErrors.title}</p>
          )}
        </div>

        {/* Precio Base */}
        <div className="pm-form-group">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Precio Base ($ USD) *
          </label>
          <input
            type="number"
            step="0.01"
            className={`w-full p-3 border rounded-xl bg-zinc-950/80 text-zinc-100 focus:border-zinc-400 outline-none text-sm transition-all ${
              validationErrors.price ? 'border-rose-500' : 'border-zinc-800'
            }`}
            placeholder="Ej. 1200.00"
            value={price}
            onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
          />
          {validationErrors.price && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{validationErrors.price}</p>
          )}
        </div>

        {/* Edición Máxima */}
        <div className="pm-form-group">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Edición Máxima [Copias] *
          </label>
          <input
            type="number"
            className={`w-full p-3 border rounded-xl bg-zinc-950/80 text-zinc-100 focus:border-zinc-400 outline-none text-sm transition-all ${
              validationErrors.edition ? 'border-rose-500' : 'border-zinc-800'
            }`}
            placeholder="Ej. 10"
            value={edition}
            onChange={(e) => setEdition(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          />
          {validationErrors.edition && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{validationErrors.edition}</p>
          )}
        </div>

        {/* Categoría */}
        <div className="pm-form-group">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Categoría *
          </label>
          <select
            className={`w-full p-3 border rounded-xl bg-zinc-950/80 text-zinc-100 focus:border-zinc-400 outline-none text-sm transition-all ${
              validationErrors.categoryId ? 'border-rose-500' : 'border-zinc-800'
            }`}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">Seleccione categoría...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {validationErrors.categoryId && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{validationErrors.categoryId}</p>
          )}
        </div>

        {/* URL de Imagen */}
        <div className="pm-form-group">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            URL de la Fotografía [Visualización]
          </label>
          <input
            type="text"
            className="w-full p-3 border border-zinc-800 rounded-xl bg-zinc-950/80 text-zinc-100 focus:border-zinc-400 outline-none text-sm transition-all"
            placeholder="Ej. https://url-de-mi-foto.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
      </div>

      {/* Subsección de Metadata Obligatoria */}
      <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 mb-6">
        <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-zinc-800/60 pb-3">
          <i className="bi bi-info-circle text-zinc-400"></i>
          Ficha Técnica y Contextual Fine Art
        </h4>

        <div className="space-y-4">
          {/* Historia de captura */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Historia de la Captura *
            </label>
            <textarea
              className={`w-full p-3 border rounded-xl bg-zinc-950 text-zinc-100 focus:border-zinc-400 outline-none h-24 resize-none text-sm transition-all ${
                validationErrors.story ? 'border-rose-500' : 'border-zinc-800'
              }`}
              placeholder="Describa el momento, la intención artística, la iluminación..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
            {validationErrors.story && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{validationErrors.story}</p>
            )}
          </div>

          {/* Ubicación geográfica */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Ubicación Geográfica *
            </label>
            <input
              type="text"
              className={`w-full p-3 border rounded-xl bg-zinc-950 text-zinc-100 focus:border-zinc-400 outline-none text-sm transition-all ${
                validationErrors.location ? 'border-rose-500' : 'border-zinc-800'
              }`}
              placeholder="Ej. South Beach, Miami Beach, FL [25.7617° N, 80.1918° W]"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {validationErrors.location && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{validationErrors.location}</p>
            )}
          </div>

          {/* Parámetros técnicos de la cámara */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Parámetros Técnicos de la Cámara *
            </label>
            <input
              type="text"
              className={`w-full p-3 border rounded-xl bg-zinc-950 text-zinc-100 focus:border-zinc-400 outline-none text-sm font-mono transition-all ${
                validationErrors.tech ? 'border-rose-500' : 'border-zinc-800'
              }`}
              placeholder="Ej. Leica M11, Summilux 50mm, f/1.4, 1/250s, ISO 64"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
            />
            {validationErrors.tech && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{validationErrors.tech}</p>
            )}
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 border-t border-zinc-800/80 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 rounded-xl text-zinc-300 font-semibold transition-all text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : photo ? (
            'Actualizar Obra'
          ) : (
            'Registrar Obra'
          )}
        </button>
      </div>
    </form>
  )
}
