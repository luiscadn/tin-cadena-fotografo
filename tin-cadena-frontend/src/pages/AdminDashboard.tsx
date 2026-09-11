// src/pages/AdminDashboard.tsx

import { useState, useEffect } from 'react'
import api from '../services/api'
import { SidebarLayout } from '../components/SidebarLayout'
import { PhotographForm } from '../components/PhotographForm'
import ConfirmModal from '../components/ConfirmModal'
import AlertModal from '../components/AlertModal'
import type { Photo } from '../types'

interface Category {
  id: number
  name: string
}

export const AdminDashboard = () => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // CRUD UI State
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<Photo | undefined>(undefined)

  // Modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    photoId: 0,
    title: ''
  })
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error' as 'success' | 'error' | 'warning' | 'info'
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [photoRes, catRes] = await Promise.all([
        api.get<Photo[]>('/photographs'),
        api.get<Category[]>('/v1/categories'),
      ])
      
      setPhotos(photoRes.data)
      setCategories(catRes.data)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Ocurrió un error al cargar la información del inventario.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData()
  }, [])

  const handleDelete = (id: number) => {
    const photo = photos.find((p) => p.id === id)
    if (photo?.status === 'SOLD') {
      setAlertModal({
        isOpen: true,
        title: 'Acción no permitida',
        message: 'No se puede eliminar una obra de arte ya vendida.',
        type: 'warning'
      })
      return
    }

    setConfirmModal({
      isOpen: true,
      photoId: id,
      title: photo?.title || 'Obra desconocida'
    })
  }

  const confirmDeletePhoto = async () => {
    try {
      setLoading(true)
      await api.delete(`/photographs/${confirmModal.photoId}`)
      loadData()
      setConfirmModal({ isOpen: false, photoId: 0, title: '' })
    } catch (err) {
      console.error('Error deleting photo:', err)
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'No fue posible eliminar la obra de arte.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (photo: Photo) => {
    if (photo.status === 'SOLD') {
      setAlertModal({
        isOpen: true,
        title: 'Acción no permitida',
        message: 'No se permite modificar una obra que ya fue vendida.',
        type: 'warning'
      })
      return
    }
    setEditingPhoto(photo)
    setIsFormOpen(true)
  }

  const handleCreateClick = () => {
    setEditingPhoto(undefined)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setEditingPhoto(undefined)
    loadData()
  }

  const getCategoryName = (catId: number): string => {
    return categories.find((c) => c.id === catId)?.name || `Categoría #${catId}`
  }

  const parseDescription = (desc: string = '') => {
    const storyMatch = desc.match(/===STORY===([\s\S]*?)(===LOCATION===|===TECHNICAL===|$)/i)
    const locationMatch = desc.match(/===LOCATION===([\s\S]*?)(===TECHNICAL===|$)/i)
    const techMatch = desc.match(/===TECHNICAL===([\s\S]*?)$/i)

    return {
      story: storyMatch ? storyMatch[1].trim() : desc.trim(),
      location: locationMatch ? locationMatch[1].trim() : '',
      tech: techMatch ? techMatch[1].trim() : '',
    }
  }

  return (
    <SidebarLayout>
      <header className="pm-page-header border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="pm-page-title flex items-center gap-2.5">
            <i className="bi bi-camera text-zinc-400"></i> Panel Operativo del Artista
          </h1>
          <p className="pm-page-subtitle">
            Gestione y supervise el catálogo exclusivo de obras fine-art de Alvaro Cadena.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={handleCreateClick}
            className="pm-btn pm-btn-primary"
          >
            <i className="bi bi-plus-lg"></i> Registrar Obra
          </button>
        )}
      </header>

      {isFormOpen ? (
        <div className="py-6">
          <PhotographForm
            photo={editingPhoto}
            onSubmitSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      ) : (
        <div className="mt-6">
          {error && (
            <div className="p-4 mb-6 bg-rose-950/40 border border-rose-800/50 text-rose-300 rounded-2xl flex items-center gap-2.5 text-sm font-medium">
              <i className="bi bi-exclamation-octagon-fill text-rose-400"></i>
              {error}
            </div>
          )}

          {loading && photos.length === 0 ? (
            <div className="flex justify-center items-center py-24 text-zinc-400 text-sm">
              <span className="loading loading-spinner loading-md mr-3 text-white"></span>
              Sincronizando inventario de la galería...
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
              <i className="bi bi-images text-4xl text-zinc-600 block mb-3"></i>
              <h3 className="text-base font-semibold text-zinc-200">No hay obras registradas</h3>
              <p className="text-sm text-zinc-500 mt-1 mb-6">
                Comience cargando su primera fotografía de edición limitada.
              </p>
              <button
                onClick={handleCreateClick}
                className="pm-btn pm-btn-primary"
              >
                Registrar Primera Obra
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto bg-zinc-900/60 border border-zinc-800/80 rounded-2xl shadow-2xl backdrop-blur-md">
              <table className="table w-full border-collapse">
                <thead>
                  <tr className="bg-zinc-950/60 text-zinc-400 border-b border-zinc-800/80 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4 text-left w-24">Pieza</th>
                    <th className="py-3.5 px-4 text-left">Detalles de la Obra</th>
                    <th className="py-3.5 px-4 text-left w-36">Ficha Contextual</th>
                    <th className="py-3.5 px-4 text-right w-28">Precio Base</th>
                    <th className="py-3.5 px-4 text-center w-24">Edición</th>
                    <th className="py-3.5 px-4 text-center w-32">Estado</th>
                    <th className="py-3.5 px-4 text-center w-32">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {photos.map((photo) => {
                    const isSold = photo.status === 'SOLD'
                    const parsedDesc = parseDescription(photo.description)
                    
                    return (
                      <tr key={photo.id} className={`hover:bg-zinc-800/30 transition-colors ${isSold ? 'opacity-75' : ''}`}>
                        {/* Thumbnail */}
                        <td className="py-4 px-4 align-middle">
                          <div className="w-16 h-20 rounded-xl overflow-hidden border border-zinc-800 shadow-md bg-zinc-950 relative">
                            <img
                              src={photo.image || 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&auto=format&fit=crop&q=80'}
                              alt={photo.title}
                              className={`w-full h-full object-cover ${isSold ? 'grayscale' : ''}`}
                            />
                            {isSold && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-[10px] bg-zinc-800 text-zinc-300 font-bold px-1.5 py-0.5 rounded border border-zinc-700">SOLD</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Title & Category */}
                        <td className="py-4 px-4 align-top">
                          <div className="font-semibold text-zinc-100 text-base tracking-tight">{photo.title}</div>
                          <div className="text-xs text-zinc-400 font-medium mt-0.5">
                            {getCategoryName(photo.categoryId)}
                          </div>
                          <p className="text-xs text-zinc-500 mt-2 line-clamp-2 max-w-sm">
                            "{parsedDesc.story}"
                          </p>
                        </td>

                        {/* Ficha Contextual */}
                        <td className="py-4 px-4 align-top text-xs text-zinc-400">
                          <div className="space-y-1.5">
                            <div>
                              <span className="font-semibold text-zinc-500 block text-[11px] uppercase tracking-wider">Ubicación</span>
                              <span className="truncate block max-w-xs text-zinc-300">{parsedDesc.location || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-zinc-500 block text-[11px] uppercase tracking-wider">Cámara</span>
                              <span className="truncate block max-w-xs text-zinc-400 font-mono text-[11px]">{parsedDesc.tech || 'N/A'}</span>
                            </div>
                          </div>
                        </td>

                        {/* Precio */}
                        <td className="py-4 px-4 align-middle text-right font-semibold text-zinc-100 text-sm">
                          ${photo.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>

                        {/* Edición */}
                        <td className="py-4 px-4 align-middle text-center text-xs font-semibold text-zinc-300">
                          #{photo.edition}
                        </td>

                        {/* Estado Badge */}
                        <td className="py-4 px-4 align-middle text-center">
                          {isSold ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
                              <i className="bi bi-lock-fill text-[10px]"></i>
                              Sold Out
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-800/50">
                              <i className="bi bi-check-circle-fill text-[10px]"></i>
                              Disponible
                            </span>
                          )}
                        </td>

                        {/* Acciones */}
                        <td className="py-4 px-4 align-middle text-center">
                          <div className="flex gap-1.5 justify-center">
                            <button
                              type="button"
                              onClick={() => handleEditClick(photo)}
                              disabled={isSold}
                              className={`p-2 rounded-xl border text-sm transition-all ${
                                isSold
                                  ? 'border-zinc-800/40 bg-zinc-900/30 text-zinc-600 cursor-not-allowed'
                                  : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-800 text-zinc-300 hover:text-white'
                              }`}
                              title={isSold ? 'Las obras vendidas están bloqueadas' : 'Editar obra'}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(photo.id)}
                              disabled={isSold}
                              className={`p-2 rounded-xl border text-sm transition-all ${
                                isSold
                                  ? 'border-zinc-800/40 bg-zinc-900/30 text-zinc-600 cursor-not-allowed'
                                  : 'border-zinc-800 bg-zinc-900/60 hover:border-rose-800/60 hover:bg-rose-950/30 text-zinc-400 hover:text-rose-300'
                              }`}
                              title={isSold ? 'Las obras vendidas están bloqueadas' : 'Eliminar obra'}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* Modal - Confirm Delete */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Eliminar Obra de Arte"
        message={`¿Está seguro de que desea eliminar permanentemente "${confirmModal.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
        onConfirm={confirmDeletePhoto}
        onCancel={() => setConfirmModal({ isOpen: false, photoId: 0, title: '' })}
      />

      {/* Modal - Alert */}
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal({ isOpen: false, title: '', message: '', type: 'error' })}
      />
    </SidebarLayout>
  )
}
