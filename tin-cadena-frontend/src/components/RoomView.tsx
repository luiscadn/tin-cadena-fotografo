// src/components/RoomView.tsx

import { useState } from 'react'

interface RoomViewProps {
  imageUrl?: string
  size: 'Classic' | 'Statement' | 'Collector'
  material: 'TruLife® Acrylic' | 'ChromaLuxe® Metal'
}

export const RoomView = ({
  imageUrl,
  size,
  material,
}: RoomViewProps) => {
  const [activeRoom, setActiveRoom] = useState<'lobby' | 'living'>('living')

  // Set multipliers:
  // Classic: 1.0, Statement: 1.5, Collector: 2.0
  const scale = size === 'Classic' ? 1.0 : size === 'Statement' ? 1.4 : 1.8

  const roomBackgrounds = {
    lobby: '/luxury_lobby.png',
    living: '/living_room.png',
  }

  // Adjust mounting position on the wall depending on background layout
  const positionClass =
    activeRoom === 'lobby'
      ? { top: '35%', left: '78%' } // luxury lobby concrete wall
      : { top: '38%', left: '55%' } // living room beige wall above sofa

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 shadow-2xl text-zinc-200">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-[11px] uppercase tracking-widest text-zinc-400 font-semibold mb-0.5">
            Visualización Inmersiva
          </h3>
          <p className="text-xs text-zinc-400">
            Previsualice la escala real en ambientes arquitectónicos.
          </p>
        </div>

        {/* Room Toggles */}
        <div className="inline-flex rounded-xl border border-zinc-800 p-1 bg-zinc-950/80">
          <button
            type="button"
            onClick={() => setActiveRoom('living')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeRoom === 'living'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Living Room
          </button>
          <button
            type="button"
            onClick={() => setActiveRoom('lobby')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeRoom === 'lobby'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Lobby de Lujo
          </button>
        </div>
      </div>

      {/* Simulated Wall Container */}
      <div className="relative w-full h-[400px] overflow-hidden rounded-xl bg-stone-950 border border-stone-800 shadow-inner flex items-center justify-center">
        {/* Background Image */}
        <img
          src={roomBackgrounds[activeRoom]}
          alt="Virtual room environment"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none brightness-[0.85] contrast-[1.05]"
        />

        {/* Wall Spotlighting effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 pointer-events-none" />

        {/* Scaled Photograph Container */}
        <div
          className="absolute transition-all duration-500 ease-out transform -translate-x-1/2 -translate-y-1/2"
          style={{
            top: positionClass.top,
            left: positionClass.left,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          {/* Custom Picture Frame with Shadows and Bevels */}
          <div className="relative border-[6px] border-stone-900 bg-stone-950 p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.65)] ring-1 ring-amber-900/40 rounded-sm">
            {/* Matte board border inside frame */}
            <div className="bg-stone-100 p-2 shadow-inner">
              <div className="relative w-20 h-28 overflow-hidden bg-stone-300 shadow-sm flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Artwork preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-[10px] text-stone-400 text-center font-serif leading-tight">
                    Fine Art
                    <br />
                    Photo
                  </div>
                )}

                {/* TruLife® Acrylic reflection highlight */}
                {material === 'TruLife® Acrylic' && (
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/15 to-white/35 skew-x-12 opacity-85 transition-opacity duration-300" />
                )}

                {/* Metal Sheen for ChromaLuxe® Metal */}
                {material === 'ChromaLuxe® Metal' && (
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-white/10 opacity-70" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Footnote */}
      <div className="mt-4 flex justify-between items-center text-[10px] text-stone-500 font-semibold px-1">
        <span>Tamaño actual: <strong className="text-amber-500">{size}</strong></span>
        <span>Soporte: <strong className="text-amber-500">{material}</strong></span>
      </div>
    </div>
  )
}
