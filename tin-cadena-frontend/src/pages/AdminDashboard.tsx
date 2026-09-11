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
      <header className="pm-page-header border-b border-stone-200 pb-4">
        <div>
          <h1 className="pm-page-title text-stone-900 font-extrabold flex items-center gap-2">
            <i className="bi bi-camera"></i> Panel Operativo del Artista
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Gestione y supervise su catálogo de obras de arte fine-art.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={handleCreateClick}
            className="pm-btn pm-btn-primary bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 border-none shadow-lg text-sm"
          >
            <i className="bi bi-plus-lg"></i> Registrar Obra
          </button>
        )}
      </header>

      {isFormOpen ? (
        <div className="py-4">
          <PhotographForm
            photo={editingPhoto}
            onSubmitSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      ) : (
        <div className="mt-6">
          {error && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 font-semibold">
              <i className="bi bi-exclamation-octagon-fill"></i>
              {error}
            </div>
          )}

          {loading && photos.length === 0 ? (
            <div className="flex justify-center items-center py-20 text-amber-700">
              <span className="loading loading-spinner loading-lg mr-2"></span>
              Sincronizando inventario con la galería...
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl p-8 shadow-inner">
              <i className="bi bi-images text-5xl text-stone-300 block mb-4"></i>
              <h3 className="text-lg font-bold text-stone-700">No hay obras registradas</h3>
              <p className="text-sm text-stone-500 mt-1 mb-6">
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
            <div className="overflow-x-auto bg-white border border-stone-200 rounded-2xl shadow-xl">
              <table className="table w-full border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                    <th className="py-3 px-4 font-bold text-xs uppercase text-left w-24">Pieza</th>
                    <th className="py-3 px-4 font-bold text-xs uppercase text-left">Detalles de la Obra</th>
                    <th className="py-3 px-4 font-bold text-xs uppercase text-left w-32">Ficha Contextual</th>
                    <th className="py-3 px-4 font-bold text-xs uppercase text-right w-24">Precio Base</th>
                    <th className="py-3 px-4 font-bold text-xs uppercase text-center w-24">Copias</th>
                    <th className="py-3 px-4 font-bold text-xs uppercase text-center w-32">Estado</th>
                    <th className="py-3 px-4 font-bold text-xs uppercase text-center w-36">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {photos.map((photo) => {
                    const isSold = photo.status === 'SOLD'
                    const parsedDesc = parseDescription(photo.description)
                    
                    return (
                      <tr key={photo.id} className={`hover:bg-stone-50/50 transition-colors ${isSold ? 'bg-stone-50/20' : ''}`}>
                        {/* Thumbnail */}
                        <td className="py-4 px-4 align-middle">
                          <div className="w-16 h-20 rounded-lg overflow-hidden border border-stone-200 shadow-sm bg-stone-100 relative">
                            <img
                              src={photo.image || 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&auto=format&fit=crop&q=80'}
                              alt={photo.title}
                              className={`w-full h-full object-cover ${isSold ? 'grayscale' : ''}`}
                            />
                            {isSold && (
                              <div className="absolute inset-0 bg-red-950/20 flex items-center justify-center">
                                <span className="text-[10px] bg-red-600 text-white font-extrabold px-1 rounded">SOLD</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Title & Category */}
                        <td className="py-4 px-4 align-top">
                          <div className="font-extrabold text-stone-900 text-base">{photo.title}</div>
                          <div className="text-xs text-amber-800 font-semibold mt-1">
                            {getCategoryName(photo.categoryId)}
                          </div>
                          <p className="text-xs text-stone-500 mt-2 line-clamp-2 max-w-sm italic">
                            "{parsedDesc.story}"
                          </p>
                        </td>

                        {/* Ficha Contextual */}
                        <td className="py-4 px-4 align-top text-xs text-stone-600">
                          <div className="space-y-1">
                            <div>
                              <span className="font-bold text-stone-500 block">Ubicación</span>
                              <span className="truncate block max-w-xs">{parsedDesc.location || 'N/A'}</span>
                            </div>
                            <div className="pt-1">
                              <span className="font-bold text-stone-500 block">Cámara</span>
                              <span className="truncate block max-w-xs text-[10px]">{parsedDesc.tech || 'N/A'}</span>
                            </div>
                          </div>
                        </td>

                        {/* Precio */}
                        <td className="py-4 px-4 align-middle text-right font-extrabold text-stone-900 text-sm">
                          ${photo.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>

                        {/* Edición */}
                        <td className="py-4 px-4 align-middle text-center text-xs font-semibold text-stone-700">
                          {photo.edition}
                        </td>

                        {/* Estado Badge */}
                        <td className="py-4 px-4 align-middle text-center">
                          {isSold ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-600 text-white shadow-sm shadow-red-500/20 border border-red-700">
                              <i className="bi bi-lock-fill"></i>
                              Sold Out
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 border border-emerald-700">
                              <i className="bi bi-check-circle-fill"></i>
                              Disponible
                            </span>
                          )}
                        </td>

                        {/* Acciones */}
                        <td className="py-4 px-4 align-middle text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              type="button"
                              onClick={() => handleEditClick(photo)}
                              disabled={isSold}
                              className={`p-2 rounded-lg border text-sm transition-all ${
                                isSold
                                  ? 'border-stone-100 bg-stone-50 text-stone-400 cursor-not-allowed'
                                  : 'border-stone-200 hover:border-amber-600 hover:bg-amber-50 text-stone-700 hover:text-amber-800'
                              }`}
                              title={isSold ? 'Las obras vendidas están bloqueadas' : 'Editar obra'}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(photo.id)}
                              disabled={isSold}
                              className={`p-2 rounded-lg border text-sm transition-all ${
                                isSold
                                  ? 'border-stone-100 bg-stone-50 text-stone-400 cursor-not-allowed'
                                  : 'border-red-100 hover:border-red-600 hover:bg-red-50 text-stone-700 hover:text-red-800'
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
