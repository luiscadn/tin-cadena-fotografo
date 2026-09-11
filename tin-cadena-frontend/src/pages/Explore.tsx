// src/pages/Explore.tsx

import { useState, useEffect } from 'react'
import api from '../services/api'
import { SidebarLayout } from '../components/SidebarLayout'
import { RoomView } from '../components/RoomView'
import { VariantConfigurator } from '../components/VariantConfigurator'
import { useFavorites } from '../hooks'
import type { Photo } from '../types'

interface Category {
  id: number
  name: string
}

export const Explore = () => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Filtering & Search
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState<number | ''>('')

  // Modal State
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<'TruLife® Acrylic' | 'ChromaLuxe® Metal'>('TruLife® Acrylic')
  const [selectedSize, setSelectedSize] = useState<'Classic' | 'Statement' | 'Collector'>('Classic')

  const { add: addFavorite, remove: removeFavorite, isFavorite } = useFavorites()

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
      console.error('Error fetching gallery:', err)
      setError('No se pudo cargar la galería del marketplace.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData()
  }, [])

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo)
    setSelectedMaterial('TruLife® Acrylic')
    setSelectedSize('Classic')
  }

  const handleFavoriteToggle = (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation()
    if (isFavorite(photo.id)) {
      removeFavorite(photo.id)
    } else {
      addFavorite(photo)
    }
  }

  const filteredPhotos = photos.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCat === '' || p.categoryId === selectedCat
    return matchesSearch && matchesCat
  })

  return (
    <SidebarLayout>
      <header className="pm-page-header border-b border-stone-200 pb-4 mb-6">
        <div>
          <h1 className="pm-page-title text-stone-900 font-extrabold flex items-center gap-2">
            <i className="bi bi-search"></i> Explorar Galería Fine-Art
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Adquiera exclusivas obras fotográficas de edición limitada y soportes premium.
          </p>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-stone-200 shadow-md">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm bg-stone-50/50 outline-none text-stone-900 focus:ring-2 focus:ring-amber-600"
            placeholder="Buscar por título, historia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            className="w-full py-2 px-3 border border-stone-200 rounded-lg text-sm bg-stone-50/50 outline-none text-stone-900 focus:ring-2 focus:ring-amber-600"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl font-semibold">
          {error}
        </div>
      )}

      {loading && photos.length === 0 ? (
        <div className="flex justify-center items-center py-20 text-amber-700">
          <span className="loading loading-spinner loading-lg mr-2"></span>
          Cargando obras de arte...
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl p-8">
          <i className="bi bi-search text-5xl text-stone-300 block mb-4"></i>
          <h3 className="text-lg font-bold text-stone-700">No se encontraron piezas</h3>
          <p className="text-sm text-stone-500 mt-1">
            Intente ajustar sus criterios de búsqueda o categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => {
            const isSold = photo.status === 'SOLD'
            const isFav = isFavorite(photo.id)
            
            return (
              <article
                key={photo.id}
                onClick={() => handlePhotoClick(photo)}
                className={`group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer ${
                  isSold ? 'opacity-85' : ''
                }`}
              >
                {/* Photo Image Card */}
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                  <img
                    src={photo.image || 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&auto=format&fit=crop&q=80'}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Sold out overlay */}
                  {isSold && (
                    <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="bg-red-600 border border-red-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg">
                        SOLD OUT
                      </span>
                    </div>
                  )}

                  {/* Favorite Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => handleFavoriteToggle(e, photo)}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white text-lg active:scale-95 transition-all"
                  >
                    <i
                      className={`bi ${isFav ? 'bi-heart-fill text-red-500' : 'bi-heart text-stone-600'}`}
                    ></i>
                  </button>
                  
                  {/* Category overlay */}
                  <span className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-sm text-[10px] text-amber-400 font-extrabold uppercase px-2 py-1 rounded">
                    {categories.find((c) => c.id === photo.categoryId)?.name || 'Colección'}
                  </span>
                </div>

                {/* Details Footer */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base leading-tight group-hover:text-amber-800 transition-colors">
                      {photo.title}
                    </h3>
                    <div className="text-[10px] text-stone-500 font-semibold mt-1">
                      Edición limitada de {photo.edition} copias
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-100">
                    <span className="text-xs text-stone-400 font-bold uppercase">Base</span>
                    <span className="font-black text-stone-900 text-base">
                      ${photo.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Immersive Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-stone-50 border border-stone-200 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl animate-fade-in flex flex-col md:flex-row max-h-[90vh]">
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-stone-200/80 hover:bg-stone-200 rounded-full flex items-center justify-center text-stone-800 text-lg font-bold shadow"
            >
              &times;
            </button>

            {/* Left Preview Column */}
            <div className="flex-1 p-6 bg-stone-900 flex flex-col justify-center overflow-y-auto min-h-[350px]">
              <RoomView
                imageUrl={selectedPhoto.image}
                size={selectedSize}
                material={selectedMaterial}
              />
            </div>

            {/* Right Configurator Column */}
            <div className="w-full md:w-[400px] p-6 overflow-y-auto bg-white flex flex-col justify-between">
              <div>
                <header className="mb-4">
                  <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                    {selectedPhoto.title}
                  </h2>
                  <span className="inline-block mt-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-250">
                    {getCategoryName(selectedPhoto.categoryId)}
                  </span>
                </header>

                <p className="text-xs text-stone-600 italic leading-relaxed mb-6 bg-stone-50 p-3 border border-stone-200 rounded-xl">
                  {selectedPhoto.description.replace(/===STORY===|===LOCATION===|===TECHNICAL===/ig, '').trim()}
                </p>

                <VariantConfigurator
                  photo={selectedPhoto}
                  onVariantChange={(m, s) => {
                    setSelectedMaterial(m)
                    setSelectedSize(s)
                  }}
                />
              </div>

              <div className="mt-6 text-[10px] text-stone-400 text-center font-semibold">
                Compra directa segura • Certificado de Autenticidad firmado por el artista.
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  )

  function getCategoryName(catId: number): string {
    return categories.find((c) => c.id === catId)?.name || 'Colección'
  }
}
