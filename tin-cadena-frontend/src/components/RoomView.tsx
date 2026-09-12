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

  // Frame depth per size drives drop-shadow physics: larger prints sit
  // proud of the wall further, so the cast shadow grows and softens.
  const depth = size === 'Classic' ? 8 : size === 'Statement' ? 13 : 18
  const wallShadow = `${depth * 1.1}px ${depth * 1.6}px ${depth * 2.6}px rgba(0,0,0,${0.5 + depth * 0.01})`

  return (
    <div className="bg-obsidian-soft border border-white/10 rounded-sm p-5 text-canvas">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-serif text-sm text-canvas mb-0.5">
            Visualización Inmersiva
          </h3>
          <p className="text-xs text-zinc-400">
            Previsualice la escala real en ambientes arquitectónicos.
          </p>
        </div>

        {/* Frosted-glass floating room switcher */}
        <div className="inline-flex rounded-sm border border-white/15 p-1 bg-white/5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveRoom('living')}
            className={`px-3 py-1 text-[11px] uppercase tracking-wide font-medium rounded-sm transition-all ${
              activeRoom === 'living'
                ? 'bg-canvas text-obsidian'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            Living Room
          </button>
          <button
            type="button"
            onClick={() => setActiveRoom('lobby')}
            className={`px-3 py-1 text-[11px] uppercase tracking-wide font-medium rounded-sm transition-all ${
              activeRoom === 'lobby'
                ? 'bg-canvas text-obsidian'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            Lobby de Lujo
          </button>
        </div>
      </div>

      {/* Simulated Wall Container */}
      <div className="relative w-full h-[400px] overflow-hidden rounded-sm bg-obsidian border border-white/10 flex items-center justify-center">
        {/* Background Image */}
        <img
          src={roomBackgrounds[activeRoom]}
          alt="Virtual room environment"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none brightness-[0.85] contrast-[1.05] transition-opacity duration-500"
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
          {/* Custom Picture Frame — shadow depth reflects physical frame profile */}
          <div
            className="relative border-[6px] border-stone-900 bg-stone-950 p-1.5 ring-1 ring-white/10 rounded-sm transition-shadow duration-500"
            style={{ boxShadow: wallShadow }}
          >
            {/* Matte board border inside frame */}
            <div className="bg-canvas p-2 shadow-inner">
              <div className="relative w-20 h-28 overflow-hidden bg-stone-300 shadow-sm flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Artwork preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-[10px] text-stone-400 text-center font-semibold leading-tight">
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

      {/* Info Footnote — EXIF-style data in monospace */}
      <div className="mt-4 flex justify-between items-center text-[10px] font-mono text-stone-500 px-1">
        <span>SIZE: <span className="text-accent-gold">{size.toUpperCase()}</span></span>
        <span>MEDIUM: <span className="text-accent-gold">{material}</span></span>
      </div>
    </div>
  )
}
