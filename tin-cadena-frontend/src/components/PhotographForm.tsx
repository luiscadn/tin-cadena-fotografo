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
    <form onSubmit={handleSubmit} className="bg-white border border-stone-250 rounded-2xl p-6 shadow-xl text-stone-800 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-3 mb-6">
        {photo ? 'Editar Obra de Arte' : 'Registrar Nueva Obra de Arte'}
      </h3>

      {error && (
        <div className="pm-alert pm-alert-error mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-center gap-2 text-sm font-semibold">
          <i className="bi bi-exclamation-triangle-fill"></i>
          {error}
        </div>
      )}

      {/* Grid General */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Título */}
        <div className="pm-form-group md:col-span-2">
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Título de la Obra *
          </label>
          <input
            type="text"
            className={`w-full p-2.5 border rounded-xl bg-stone-50/50 text-stone-950 focus:ring-2 focus:ring-amber-600 outline-none ${
              validationErrors.title ? 'border-red-400' : 'border-stone-200'
            }`}
            placeholder="Ej. Murmullos del Silencio"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {validationErrors.title && (
            <p className="text-xs text-red-500 mt-1 font-semibold">{validationErrors.title}</p>
          )}
        </div>

        {/* Precio Base */}
        <div className="pm-form-group">
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Precio Base ($ USD) *
          </label>
          <input
            type="number"
            step="0.01"
            className={`w-full p-2.5 border rounded-xl bg-stone-50/50 text-stone-950 focus:ring-2 focus:ring-amber-600 outline-none ${
              validationErrors.price ? 'border-red-400' : 'border-stone-200'
            }`}
            placeholder="Ej. 1200.00"
            value={price}
            onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
          />
          {validationErrors.price && (
            <p className="text-xs text-red-500 mt-1 font-semibold">{validationErrors.price}</p>
          )}
        </div>

        {/* Edición Máxima */}
        <div className="pm-form-group">
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Edición Máxima (Copias) *
          </label>
          <input
            type="number"
            className={`w-full p-2.5 border rounded-xl bg-stone-50/50 text-stone-950 focus:ring-2 focus:ring-amber-600 outline-none ${
              validationErrors.edition ? 'border-red-400' : 'border-stone-200'
            }`}
            placeholder="Ej. 10"
            value={edition}
            onChange={(e) => setEdition(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          />
          {validationErrors.edition && (
            <p className="text-xs text-red-500 mt-1 font-semibold">{validationErrors.edition}</p>
          )}
        </div>

        {/* Categoría */}
        <div className="pm-form-group">
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Categoría *
          </label>
          <select
            className={`w-full p-2.5 border rounded-xl bg-stone-50/50 text-stone-950 focus:ring-2 focus:ring-amber-600 outline-none ${
              validationErrors.categoryId ? 'border-red-400' : 'border-stone-200'
            }`}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">Seleccione...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {validationErrors.categoryId && (
            <p className="text-xs text-red-500 mt-1 font-semibold">{validationErrors.categoryId}</p>
          )}
        </div>

        {/* URL de Imagen */}
        <div className="pm-form-group">
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            URL de la Fotografía (Visualización)
          </label>
          <input
            type="text"
            className="w-full p-2.5 border border-stone-200 rounded-xl bg-stone-50/50 text-stone-950 focus:ring-2 focus:ring-amber-600 outline-none"
            placeholder="Ej. https://url-de-mi-foto.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
      </div>

      {/* Subsección de Metadata Obligatoria */}
      <div className="bg-amber-50/30 border border-amber-900/10 rounded-2xl p-4 mb-6">
        <h4 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-1.5 border-b border-amber-900/10 pb-2">
          <i className="bi bi-info-circle-fill text-amber-700"></i>
          Ficha Técnica & Contextual Fine Art
        </h4>

        <div className="space-y-4">
          {/* Historia de captura */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Historia de la Captura *
            </label>
            <textarea
              className={`w-full p-2.5 border rounded-xl bg-white text-stone-950 focus:ring-2 focus:ring-amber-600 outline-none h-20 resize-none text-sm ${
                validationErrors.story ? 'border-red-400' : 'border-stone-200'
              }`}
              placeholder="Describa el momento, la intención artística, la luz..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
            {validationErrors.story && (
              <p className="text-[10px] text-red-500 mt-0.5 font-semibold">{validationErrors.story}</p>
            )}
          </div>

          {/* Ubicación geográfica */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Ubicación Geográfica *
            </label>
            <input
              type="text"
              className={`w-full p-2.5 border rounded-xl bg-white text-stone-950 focus:ring-2 focus:ring-amber-600 outline-none text-sm ${
                validationErrors.location ? 'border-red-400' : 'border-stone-200'
              }`}
              placeholder="Ej. Desierto de Atacama, Chile (23° S, 67° W)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {validationErrors.location && (
              <p className="text-[10px] text-red-500 mt-0.5 font-semibold">{validationErrors.location}</p>
            )}
          </div>

          {/* Parámetros técnicos de la cámara */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Parámetros Técnicos de la Cámara *
            </label>
            <input
              type="text"
              className={`w-full p-2.5 border rounded-xl bg-white text-stone-950 focus:ring-2 focus:ring-amber-600 outline-none text-sm ${
                validationErrors.tech ? 'border-red-400' : 'border-stone-200'
              }`}
              placeholder="Ej. Leica M11, Summilux 50mm, f/1.4, 1/250s, ISO 64"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
            />
            {validationErrors.tech && (
              <p className="text-[10px] text-red-500 mt-0.5 font-semibold">{validationErrors.tech}</p>
            )}
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 border-t border-stone-100 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 border border-stone-300 hover:bg-stone-50 rounded-xl text-stone-700 font-bold transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
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
