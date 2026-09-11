// src/pages/Favorites.tsx

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
      <header className="pm-page-header border-b border-stone-200 pb-4 mb-6">
        <div>
          <h1 className="pm-page-title text-stone-900 font-extrabold flex items-center gap-2">
            <i className="bi bi-heart-fill text-red-500"></i> Mi Wishlist de Favoritos
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Sus obras seleccionadas para adquisición. Recibirá notificaciones en tiempo real si alguna cambia su disponibilidad.
          </p>
        </div>
      </header>

      {favoriteItems.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl p-8">
          <i className="bi bi-heart text-5xl text-stone-300 block mb-4"></i>
          <h3 className="text-lg font-bold text-stone-700">Su lista está vacía</h3>
          <p className="text-sm text-stone-500 mt-1">
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
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Photo Image Card */}
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                  <img
                    src={photo.image || 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&auto=format&fit=crop&q=80'}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {isSold && (
                    <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="bg-red-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-full">
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
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white text-lg text-red-500 active:scale-95 transition-all"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>

                {/* Details Footer */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base leading-tight">
                      {photo.title}
                    </h3>
                    <div className="text-[10px] text-stone-500 font-semibold mt-1">
                      {getCategoryName(photo.categoryId)}
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
}
