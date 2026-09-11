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
      <header className="pm-page-header border-b border-zinc-800/80 pb-5 mb-6">
        <div>
          <h1 className="pm-page-title flex items-center gap-2.5">
            <i className="bi bi-search text-zinc-400"></i> Explorar Galería Fine-Art
          </h1>
          <p className="pm-page-subtitle">
            Obras fotográficas exclusivas de edición limitada por Alvaro Cadena con soportes de calidad de museo.
          </p>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800/80 backdrop-blur-md shadow-lg">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 border border-zinc-800 rounded-xl text-sm bg-zinc-950/80 outline-none text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 transition-all"
            placeholder="Buscar por título, historia, ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-60">
          <select
            className="w-full py-2.5 px-3.5 border border-zinc-800 rounded-xl text-sm bg-zinc-950/80 outline-none text-zinc-200 focus:border-zinc-500 transition-all"
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
        <div className="p-4 mb-6 bg-rose-950/40 border border-rose-800/50 text-rose-300 rounded-2xl text-sm font-medium flex items-center gap-2.5">
          <i className="bi bi-exclamation-octagon-fill text-rose-400"></i>
          {error}
        </div>
      )}

      {loading && photos.length === 0 ? (
        <div className="flex justify-center items-center py-24 text-zinc-400 text-sm">
          <span className="loading loading-spinner loading-md mr-3 text-white"></span>
          Cargando obras de arte...
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
          <i className="bi bi-search text-4xl text-zinc-600 block mb-3"></i>
          <h3 className="text-base font-semibold text-zinc-200">No se encontraron piezas</h3>
          <p className="text-sm text-zinc-500 mt-1">
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
                className={`group bg-zinc-900/60 rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-zinc-700/80 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer ${
                  isSold ? 'opacity-80' : ''
                }`}
              >
                {/* Photo Image Card */}
                <div className="relative aspect-[3/4] bg-zinc-950 overflow-hidden">
                  <img
                    src={photo.image || 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&auto=format&fit=crop&q=80'}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Sold out overlay */}
                  {isSold && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-zinc-900/90 border border-zinc-700 text-zinc-300 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        SOLD OUT
                      </span>
                    </div>
                  )}

                  {/* Favorite Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => handleFavoriteToggle(e, photo)}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center border border-zinc-700/60 shadow-md text-sm active:scale-95 transition-all"
                  >
                    <i
                      className={`bi ${isFav ? 'bi-heart-fill text-rose-500' : 'text-zinc-300 bi-heart'}`}
                    ></i>
                  </button>
                  
                  {/* Category overlay */}
                  <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-[10px] text-zinc-300 font-semibold uppercase px-2.5 py-1 rounded-md border border-zinc-700/60">
                    {categories.find((c) => c.id === photo.categoryId)?.name || 'Colección'}
                  </span>
                </div>

                {/* Details Footer */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-zinc-100 text-base leading-tight group-hover:text-white transition-colors">
                      {photo.title}
                    </h3>
                    <div className="text-[11px] text-zinc-400 font-medium mt-1">
                      Edición limitada de #{photo.edition} copias
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Base</span>
                    <span className="font-semibold text-white text-base">
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center text-zinc-300 hover:text-white text-base font-bold shadow transition-all"
            >
              &times;
            </button>

            {/* Left Preview Column */}
            <div className="flex-1 p-6 bg-zinc-950 flex flex-col justify-center overflow-y-auto min-h-[350px]">
              <RoomView
                imageUrl={selectedPhoto.image}
                size={selectedSize}
                material={selectedMaterial}
              />
            </div>

            {/* Right Configurator Column */}
            <div className="w-full md:w-[420px] p-6 md:p-8 overflow-y-auto bg-zinc-900 border-l border-zinc-800/80 flex flex-col justify-between">
              <div>
                <header className="mb-4">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {selectedPhoto.title}
                  </h2>
                  <span className="inline-block mt-1.5 text-xs font-semibold text-zinc-300 bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-700/60">
                    {getCategoryName(selectedPhoto.categoryId)}
                  </span>
                </header>

                <p className="text-xs text-zinc-400 leading-relaxed mb-6 bg-zinc-950/60 p-4 border border-zinc-800/80 rounded-xl">
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

              <div className="mt-6 text-[11px] text-zinc-500 text-center font-medium">
                Compra directa segura • Certificado de Autenticidad firmado por Alvaro Cadena.
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
