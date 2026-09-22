// src/pages/Favorites.tsx

import { useState, useEffect } from 'react'
import api from '../services/api'
import { SidebarLayout } from '../components/SidebarLayout'
import { RoomView } from '../components/RoomView'
import { VariantConfigurator } from '../components/VariantConfigurator'
import { useFavorites } from '../hooks'
import { getPhotoUrl } from '../utils/imageUtils'
import type { Photo } from '../types'

interface Category {
  id: number
  name: string
}

export const Favorites = () => {
  const { items: favoriteItems, remove: removeFavorite } = useFavorites()
  const [categories, setCategories] = useState<Category[]>([])
  
  // Modal State
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<'TruLife® Acrylic' | 'ChromaLuxe® Metal'>('TruLife® Acrylic')
  const [selectedSize, setSelectedSize] = useState<'Classic' | 'Statement' | 'Collector'>('Classic')

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catRes = await api.get<Category[]>('/v1/categories')
        setCategories(catRes.data)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    fetchCats()
  }, [])

  const getCategoryName = (catId: number): string => {
    return categories.find((c) => c.id === catId)?.name || 'Colección'
  }

  return (
    <SidebarLayout>
      <header className="pm-page-header border-b border-zinc-800/80 pb-5 mb-6">
        <div>
          <h1 className="pm-page-title flex items-center gap-2.5">
            <i className="bi bi-heart-fill text-rose-500"></i> Mi Wishlist de Favoritos
          </h1>
          <p className="pm-page-subtitle">
            Obras seleccionadas para adquisición. Notificaciones automáticas de stock y ediciones limitadas en tiempo real.
          </p>
        </div>
      </header>

      {favoriteItems.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
          <i className="bi bi-heart text-4xl text-zinc-600 block mb-3"></i>
          <h3 className="text-base font-semibold text-zinc-200">Su lista de favoritos está vacía</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Explore la galería y marque sus piezas favoritas con el icono de corazón.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favoriteItems.map((photo) => {
            const isSold = photo.status === 'SOLD'
            
            return (
              <article
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group bg-zinc-900/60 rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-zinc-700/80 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Photo Image Card */}
                <div className="relative aspect-[3/4] bg-zinc-950 overflow-hidden">
                  <img
                    src={getPhotoUrl(photo.image)}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {isSold && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-zinc-900/90 border border-zinc-700 text-zinc-300 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        SOLD OUT
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFavorite(photo.id)
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-md text-xs text-rose-400 hover:text-rose-300 border border-zinc-700/60 active:scale-95 transition-all"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>

                {/* Details Footer */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-zinc-100 text-base leading-tight group-hover:text-white transition-colors">
                      {photo.title}
                    </h3>
                    <div className="text-[11px] text-zinc-400 font-medium mt-1">
                      {getCategoryName(photo.categoryId)}
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
}
