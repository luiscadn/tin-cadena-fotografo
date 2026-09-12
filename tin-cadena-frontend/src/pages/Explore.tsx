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
      <header className="border-b border-white/10 pb-5 mb-6">
        <div>
          <h1 className="font-serif text-2xl text-canvas flex items-center gap-2.5">
            Explorar Galería Fine-Art
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Obras fotográficas exclusivas de edición limitada por Alvaro Cadena con soportes de calidad de museo.
          </p>
        </div>
      </header>

      {/* Minimal sticky filter / category bar */}
      <div className="sticky top-0 z-10 -mx-2 px-2 py-3 mb-8 bg-obsidian/90 backdrop-blur-md border-b border-white/10 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
            <i className="bi bi-search text-xs"></i>
          </span>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 border border-white/10 rounded-sm text-sm bg-black/30 outline-none text-zinc-100 placeholder-zinc-500 focus:border-white/30 transition-all"
            placeholder="Buscar por título, historia, ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCat('')}
            className={`shrink-0 px-3 py-2 text-[11px] uppercase tracking-wide rounded-sm border transition-colors ${
              selectedCat === ''
                ? 'border-canvas bg-canvas text-obsidian'
                : 'border-white/10 text-zinc-400 hover:border-white/25 hover:text-white'
            }`}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCat(c.id)}
              className={`shrink-0 px-3 py-2 text-[11px] uppercase tracking-wide rounded-sm border transition-colors ${
                selectedCat === c.id
                  ? 'border-canvas bg-canvas text-obsidian'
                  : 'border-white/10 text-zinc-400 hover:border-white/25 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-rose-950/40 border border-rose-800/50 text-rose-300 rounded-sm text-sm font-medium flex items-center gap-2.5">
          <i className="bi bi-exclamation-octagon-fill text-rose-400"></i>
          {error}
        </div>
      )}

      {loading && photos.length === 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="mb-6 break-inside-avoid bg-obsidian-soft border border-white/10 rounded-sm overflow-hidden animate-pulse"
              style={{ aspectRatio: i % 3 === 0 ? '4 / 5' : i % 3 === 1 ? '3 / 2' : '1 / 1' }}
            >
              <div className="w-full h-full bg-white/5" />
            </div>
          ))}
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-sm p-8">
          <i className="bi bi-search text-4xl text-zinc-600 block mb-3"></i>
          <h3 className="font-serif text-base text-zinc-200">No se encontraron piezas</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Intente ajustar sus criterios de búsqueda o categoría.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {filteredPhotos.map((photo) => {
            const isSold = photo.status === 'SOLD'
            const isFav = isFavorite(photo.id)

            return (
              <article
                key={photo.id}
                onClick={() => handlePhotoClick(photo)}
                className={`group relative mb-6 break-inside-avoid bg-obsidian-soft rounded-sm overflow-hidden border border-white/10 hover:border-white/25 transition-colors duration-300 cursor-pointer ${
                  isSold ? 'opacity-80' : ''
                }`}
              >
                {/* Image — natural aspect ratio, no forced cropping */}
                <div className="relative bg-black">
                  <img
                    src={photo.image || 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800&auto=format&fit=crop&q=80'}
                    alt={photo.title}
                    className="w-full h-auto block"
                  />

                  {isSold && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-obsidian/90 border border-white/20 text-zinc-300 text-[10px] font-medium uppercase tracking-wide px-3 py-1 rounded-sm">
                        Sold Out
                      </span>
                    </div>
                  )}

                  {/* Hover overlay: minimal metadata, price, actions */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between">
                    <div>
                      <h3 className="font-serif text-sm text-white leading-tight">{photo.title}</h3>
                      <div className="text-[10px] font-mono text-zinc-300 mt-1">
                        Alvaro Cadena · Ed. #{photo.edition}
                      </div>
                      <div className="text-[11px] font-mono text-accent-gold mt-1">
                        ${photo.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleFavoriteToggle(e, photo)}
                      className="w-8 h-8 shrink-0 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-sm flex items-center justify-center border border-white/15 text-sm transition-all"
                    >
                      <i className={`bi ${isFav ? 'bi-heart-fill text-rose-500' : 'text-zinc-200 bi-heart'}`}></i>
                    </button>
                  </div>

                  {/* Category tag, always visible */}
                  <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-[10px] text-zinc-200 font-medium uppercase px-2 py-1 rounded-sm border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity">
                    {categories.find((c) => c.id === photo.categoryId)?.name || 'Colección'}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Immersive Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-obsidian-soft border border-white/10 rounded-sm w-full max-w-5xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-sm flex items-center justify-center text-zinc-300 hover:text-white text-base font-bold transition-all"
            >
              &times;
            </button>

            {/* Left Preview Column */}
            <div className="flex-1 p-6 bg-obsidian flex flex-col justify-center overflow-y-auto min-h-[350px]">
              <RoomView
                imageUrl={selectedPhoto.image}
                size={selectedSize}
                material={selectedMaterial}
              />
            </div>

            {/* Right Configurator Column */}
            <div className="w-full md:w-[420px] p-6 md:p-8 overflow-y-auto bg-obsidian-soft border-l border-white/10 flex flex-col justify-between">
              <div>
                <header className="mb-4">
                  <h2 className="font-serif text-2xl text-white tracking-tight">
                    {selectedPhoto.title}
                  </h2>
                  <span className="inline-block mt-1.5 text-[10px] uppercase tracking-wide font-medium text-zinc-300 bg-white/5 px-2.5 py-1 rounded-sm border border-white/10">
                    {getCategoryName(selectedPhoto.categoryId)}
                  </span>
                </header>

                <p className="text-xs text-zinc-400 leading-relaxed mb-6 bg-black/20 p-4 border border-white/10 rounded-sm">
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
