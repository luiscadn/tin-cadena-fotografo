// src/components/ExhibitionGrid.tsx

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArtworkCard } from './ArtworkCard'
import { RoomView } from './RoomView'
import { VariantConfigurator } from './VariantConfigurator'
import { useAuth, useFavorites } from '../hooks'
import type { Photo } from '../types'

interface Category {
  id: number
  name: string
}

interface ExhibitionGridProps {
  photos: Photo[]
  categories: Category[]
  loading: boolean
  error: string | null
  eyebrow: string
  title: string
  subtitle: string
}

export const ExhibitionGrid = ({
  photos,
  categories,
  loading,
  error,
  eyebrow,
  title,
  subtitle,
}: ExhibitionGridProps) => {
  const { isAuthenticated } = useAuth()
  const { add: addFavorite, remove: removeFavorite, isFavorite } = useFavorites()

  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState<number | ''>('')

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<'TruLife® Acrylic' | 'ChromaLuxe® Metal'>('TruLife® Acrylic')
  const [selectedSize, setSelectedSize] = useState<'Classic' | 'Statement' | 'Collector'>('Classic')

  const handleOpenPhoto = (photo: Photo) => {
    setSelectedPhoto(photo)
    setSelectedMaterial('TruLife® Acrylic')
    setSelectedSize('Classic')
  }

  const handleFavoriteToggle = (photo: Photo) => {
    if (isFavorite(photo.id)) {
      removeFavorite(photo.id)
    } else {
      addFavorite(photo)
    }
  }

  const getCategoryName = (catId: number): string =>
    categories.find((c) => c.id === catId)?.name || 'Colección'

  const filteredPhotos = photos.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCat === '' || p.categoryId === selectedCat
    return matchesSearch && matchesCat
  })

  return (
    <>
      {/* Curatorial header — quiet luxury statement */}
      <header className="max-w-3xl mx-auto text-center mb-14 space-y-4">
        <span className="block text-[10px] font-mono uppercase tracking-[0.35em] text-stone-400">
          {eyebrow}
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
          {title}
        </h2>
        <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed max-w-2xl mx-auto tracking-wide pt-1">
          {subtitle}
        </p>
      </header>

      {/* Editorial index navigation — hairline underline, no chips or dropdowns */}
      <nav className="mb-14 border-y border-white/5 py-4 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar sticky top-0 z-10 bg-obsidian/90 backdrop-blur-md">
        <div className="flex items-center space-x-8 sm:space-x-10 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedCat('')}
            className={`text-[11px] uppercase tracking-[0.2em] transition-all duration-300 pb-1 relative whitespace-nowrap ${
              selectedCat === ''
                ? "text-white font-medium after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-white"
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Todas las Obras
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCat(c.id)}
              className={`text-[11px] uppercase tracking-[0.2em] transition-all duration-300 pb-1 relative whitespace-nowrap ${
                selectedCat === c.id
                  ? "text-white font-medium after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-white"
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar en el archivo..."
          className="hidden md:block shrink-0 w-56 bg-transparent border-b border-white/10 focus:border-white/30 outline-none text-[11px] text-stone-300 placeholder-stone-500 tracking-wide py-1 transition-colors"
        />
      </nav>

      {error && (
        <div className="p-4 mb-6 bg-rose-950/40 border border-rose-800/50 text-rose-300 rounded-sm text-sm font-medium flex items-center gap-2.5">
          <i className="bi bi-exclamation-octagon-fill text-rose-400"></i>
          {error}
        </div>
      )}

      {loading && photos.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[460px] bg-[#111114] border border-white/5 animate-pulse flex items-center justify-center"
            >
              <div className="w-2/3 h-2/3 bg-white/5" />
            </div>
          ))}
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 p-8">
          <i className="bi bi-search text-4xl text-zinc-600 block mb-3"></i>
          <h3 className="font-serif text-base text-zinc-200">No se encontraron piezas</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Intente ajustar sus criterios de búsqueda o categoría.
          </p>
        </div>
      ) : (
        /* Exhibition grid — pedestal-mounted works */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
          {filteredPhotos.map((photo) => (
            <ArtworkCard
              key={photo.id}
              photo={photo}
              categoryName={getCategoryName(photo.categoryId)}
              isFavorite={isFavorite(photo.id)}
              onToggleFavorite={(e) => {
                e.stopPropagation()
                handleFavoriteToggle(photo)
              }}
              onOpen={() => handleOpenPhoto(photo)}
            />
          ))}
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

              {!isAuthenticated ? (
                <div className="mt-4 p-3.5 rounded-sm bg-black/30 border border-white/10 text-xs text-zinc-400 flex items-center justify-between gap-3">
                  <span>Para concretar la compra y registrar el certificado a su nombre:</span>
                  <Link
                    to="/login"
                    className="px-3 py-1.5 bg-white text-zinc-950 font-semibold rounded-sm text-xs hover:bg-zinc-200 whitespace-nowrap"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              ) : (
                <div className="mt-6 text-[11px] text-zinc-500 text-center font-medium">
                  Compra directa segura • Certificado de Autenticidad firmado por Alvaro Cadena.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
