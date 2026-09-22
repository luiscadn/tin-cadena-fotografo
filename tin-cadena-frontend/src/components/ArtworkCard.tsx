// src/components/ArtworkCard.tsx

import type { MouseEvent } from 'react'
import type { Photo } from '../types'
import { getPhotoUrl } from '../utils/imageUtils'

interface ArtworkCardProps {
  photo: Photo
  categoryName: string
  isFavorite: boolean
  onToggleFavorite: (e: MouseEvent<HTMLButtonElement>) => void
  onOpen: () => void
}

export const ArtworkCard = ({
  photo,
  categoryName,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: ArtworkCardProps) => {
  const isSold = photo.status === 'SOLD'
  const year = photo.createdAt ? new Date(photo.createdAt).getFullYear() : null

  return (
    <article
      onClick={onOpen}
      className={`group flex flex-col bg-[#111114] border border-white/5 hover:border-white/15 transition-all duration-500 ease-out cursor-pointer ${
        isSold ? 'opacity-70' : ''
      }`}
    >
      {/* Exhibition pedestal — generous passepartout, no forced cropping */}
      <div className="relative w-full h-[460px] p-8 flex items-center justify-center bg-[#0e0e11] overflow-hidden">
        <img
          src={getPhotoUrl(photo.image)}
          alt={photo.title}
          className="max-w-full max-h-full w-auto h-auto object-contain shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />

        {isSold && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-obsidian/90 border border-white/20 text-zinc-300 text-[10px] font-medium uppercase tracking-wide px-3 py-1">
              Sold Out
            </span>
          </div>
        )}

        {/* Discreet favorite toggle */}
        <button
          type="button"
          onClick={onToggleFavorite}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <i className={`bi ${isFavorite ? 'bi-heart-fill text-rose-500' : 'text-zinc-300 bi-heart'}`}></i>
        </button>

        {/* Discreet Room View launch */}
        <button
          type="button"
          onClick={onOpen}
          className="absolute bottom-4 right-4 text-[10px] uppercase font-mono tracking-widest bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-white"
        >
          Simular en Sala ↗
        </button>
      </div>

      {/* Technical / acquisition record */}
      <div className="p-6 text-center space-y-2 border-t border-white/5">
        <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
          {categoryName}
          {year ? ` · ${year}` : ''}
        </div>

        <h2 className="font-serif text-lg tracking-wide text-white font-normal group-hover:text-stone-200 transition-colors">
          {photo.title}
        </h2>

        <p className="text-[11px] text-stone-400 font-light tracking-wider">
          Edición Limitada de {photo.edition}
        </p>

        <div className="pt-3 flex items-center justify-center">
          <span className="font-mono text-sm tracking-wider text-stone-200">
            ${photo.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}{' '}
            <span className="text-[10px] text-stone-400">USD</span>
          </span>
        </div>
      </div>
    </article>
  )
}
