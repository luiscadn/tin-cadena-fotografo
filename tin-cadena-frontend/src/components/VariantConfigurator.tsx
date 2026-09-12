// src/components/VariantConfigurator.tsx

import { useState, useMemo } from 'react'
import { useCart } from '../hooks'
import type { Photo, CartItem } from '../types'

interface VariantConfiguratorProps {
  photo: Photo
  onVariantChange?: (material: 'TruLife® Acrylic' | 'ChromaLuxe® Metal', size: 'Classic' | 'Statement' | 'Collector') => void
}

export const VariantConfigurator = ({
  photo,
  onVariantChange,
}: VariantConfiguratorProps) => {
  const { add } = useCart()

  const [material, setMaterial] = useState<'TruLife® Acrylic' | 'ChromaLuxe® Metal'>(
    'TruLife® Acrylic',
  )
  const [size, setSize] = useState<'Classic' | 'Statement' | 'Collector'>('Classic')
  const [quantity, setQuantity] = useState<number>(1)
  const [addedMessage, setAddedMessage] = useState<boolean>(false)

  // Calculations:
  // TruLife® Acrylic: +20% (1.20)
  // ChromaLuxe® Metal: +10% (1.10)
  // Classic: x1.0
  // Statement: x1.5
  // Collector: x2.0
  const finalPrice = useMemo(() => {
    const sizeMultiplier = size === 'Classic' ? 1.0 : size === 'Statement' ? 1.5 : 2.0
    const materialAddon = material === 'TruLife® Acrylic' ? 0.20 : 0.10
    const total = photo.price * sizeMultiplier * (1 + materialAddon)
    return Math.round(total * 100) / 100
  }, [photo.price, material, size])

  const handleMaterialSelect = (selected: 'TruLife® Acrylic' | 'ChromaLuxe® Metal') => {
    setMaterial(selected)
    onVariantChange?.(selected, size)
  }

  const handleSizeSelect = (selected: 'Classic' | 'Statement' | 'Collector') => {
    setSize(selected)
    onVariantChange?.(material, selected)
  }

  const handleAddToCart = () => {
    const key = `${photo.id}-${material}-${size}`
    const item: CartItem = {
      key,
      id: photo.id,
      name: `${photo.title} [${size} · ${material}]`,
      quantity,
      price: finalPrice,
      basePrice: photo.price,
      material,
      size,
      image: photo.image,
    }

    add(item)
    setAddedMessage(true)
    setTimeout(() => setAddedMessage(false), 3000)
  }

  const isSold = photo.status === 'SOLD'

  // Ledger breakdown: base print + frame/material surcharge = final unit price
  const sizeMultiplier = size === 'Classic' ? 1.0 : size === 'Statement' ? 1.5 : 2.0
  const materialAddonRate = material === 'TruLife® Acrylic' ? 0.2 : 0.1
  const basePrint = Math.round(photo.price * sizeMultiplier * 100) / 100
  const frameSurcharge = Math.round(basePrint * materialAddonRate * 100) / 100

  const materials: {
    id: 'TruLife® Acrylic' | 'ChromaLuxe® Metal'
    label: string
    description: string
    surcharge: string
    swatch: string
  }[] = [
    {
      id: 'TruLife® Acrylic',
      label: 'TruLife® Acrylic',
      description: 'Vidrio acrílico antireflejo',
      surcharge: '+20%',
      swatch: 'bg-gradient-to-br from-white/40 via-white/10 to-transparent border-white/40',
    },
    {
      id: 'ChromaLuxe® Metal',
      label: 'ChromaLuxe® Metal',
      description: 'Aluminio sublimado, acabado mate',
      surcharge: '+10%',
      swatch: 'bg-gradient-to-br from-zinc-500 via-zinc-700 to-zinc-900 border-zinc-500/40',
    },
  ]

  return (
    <div className="bg-obsidian-soft border border-white/10 rounded-sm p-6 text-canvas">
      <div className="mb-5">
        <h3 className="font-serif text-base text-canvas mb-1">
          Configurador de Acabados
        </h3>
        <p className="text-xs text-zinc-400">
          Personalice el soporte de calidad museo para su obra.
        </p>
      </div>

      {/* Selector de Material — physical swatches */}
      <div className="mb-6">
        <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-2">
          Soporte / Material
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {materials.map((m) => (
            <button
              key={m.id}
              type="button"
              disabled={isSold}
              onClick={() => handleMaterialSelect(m.id)}
              className={`flex items-start gap-3 p-3.5 rounded-sm border text-left transition-all ${
                material === m.id
                  ? 'border-canvas bg-white/5 text-white'
                  : 'border-white/10 hover:border-white/25 bg-black/20 text-zinc-300'
              } ${isSold ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <span
                className={`mt-0.5 h-8 w-8 shrink-0 rounded-sm border ${m.swatch}`}
                aria-hidden="true"
              />
              <span className="flex flex-col">
                <span className="font-medium text-sm text-white">{m.label}</span>
                <span className="text-xs text-zinc-400 mt-0.5">{m.description} [{m.surcharge}]</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selector de Tamaño */}
      <div className="mb-6">
        <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-2">
          Dimensiones de Impresión
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['Classic', 'Statement', 'Collector'] as const).map((s) => {
            const multiplierStr = s === 'Classic' ? 'x1.0' : s === 'Statement' ? 'x1.5' : 'x2.0'
            return (
              <button
                key={s}
                type="button"
                disabled={isSold}
                onClick={() => handleSizeSelect(s)}
                className={`py-2.5 px-3 rounded-sm border text-center font-medium text-xs transition-all ${
                  size === s
                    ? 'border-canvas bg-canvas text-obsidian'
                    : 'border-white/10 hover:border-white/25 bg-black/20 text-zinc-300'
                } ${isSold ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div>{s}</div>
                <div className={`text-[10px] font-mono ${size === s ? 'text-obsidian/60' : 'text-zinc-500'} mt-0.5`}>
                  {multiplierStr}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Price Ledger — transparent breakdown */}
      <div className="border-t border-white/10 pt-5 mb-6">
        <div className="font-mono text-xs text-zinc-400 space-y-1.5 mb-4">
          <div className="flex justify-between">
            <span>Impresión base ({size})</span>
            <span className="text-zinc-300">${basePrint.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Soporte {material}</span>
            <span className="text-zinc-300">+${frameSurcharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Cantidad</span>
            <span className="text-zinc-300">×{quantity}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] text-zinc-500 block font-medium uppercase tracking-wider">Valor Total</span>
            <span className="text-2xl font-serif text-white tracking-tight">
              ${(finalPrice * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center border border-white/10 rounded-sm overflow-hidden bg-black/30 h-10">
            <button
              type="button"
              disabled={quantity <= 1 || isSold}
              onClick={() => setQuantity((q) => q - 1)}
              className="px-3 hover:bg-white/10 text-zinc-300 font-medium h-full transition-colors disabled:opacity-40"
            >
              -
            </button>
            <span className="px-4 text-sm font-mono text-zinc-100">{quantity}</span>
            <button
              type="button"
              disabled={isSold}
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 hover:bg-white/10 text-zinc-300 font-medium h-full transition-colors disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="space-y-3">
        <button
          type="button"
          disabled={isSold}
          onClick={handleAddToCart}
          className={`w-full py-3.5 px-4 rounded-sm font-medium text-center flex justify-center items-center gap-2 transition-all text-sm ${
            isSold
              ? 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/10'
              : 'bg-canvas hover:bg-white text-obsidian active:scale-[0.98]'
          }`}
        >
          {isSold ? (
            <>
              <i className="bi bi-x-circle-fill text-zinc-500"></i>
              Agotado [Sold Out]
            </>
          ) : (
            <>
              <i className="bi bi-bag-plus"></i>
              Añadir a la Colección
            </>
          )}
        </button>

        {addedMessage && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs font-medium rounded-sm text-center flex items-center justify-center gap-2">
            <i className="bi bi-check-circle-fill"></i>
            ¡Obra configurada añadida a su carrito!
          </div>
        )}
      </div>
    </div>
  )
}
