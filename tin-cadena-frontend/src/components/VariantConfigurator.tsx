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

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-xl text-zinc-100">
      <div className="mb-4">
        <h3 className="text-[11px] uppercase tracking-widest text-zinc-400 font-semibold mb-1">
          Configurador de Acabados
        </h3>
        <p className="text-xs text-zinc-400">
          Personalice el soporte de calidad museo para su obra.
        </p>
      </div>

      {/* Selector de Material */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Soporte / Material
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isSold}
            onClick={() => handleMaterialSelect('TruLife® Acrylic')}
            className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
              material === 'TruLife® Acrylic'
                ? 'border-white bg-zinc-800/80 ring-1 ring-white/30 text-white'
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 text-zinc-300'
            } ${isSold ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span className="font-semibold text-sm text-white">TruLife® Acrylic</span>
            <span className="text-xs text-zinc-400 mt-1">Acrílico antireflejo [+20%]</span>
          </button>

          <button
            type="button"
            disabled={isSold}
            onClick={() => handleMaterialSelect('ChromaLuxe® Metal')}
            className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
              material === 'ChromaLuxe® Metal'
                ? 'border-white bg-zinc-800/80 ring-1 ring-white/30 text-white'
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 text-zinc-300'
            } ${isSold ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span className="font-semibold text-sm text-white">ChromaLuxe® Metal</span>
            <span className="text-xs text-zinc-400 mt-1">Aluminio sublimado [+10%]</span>
          </button>
        </div>
      </div>

      {/* Selector de Tamaño */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
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
                className={`py-2.5 px-3 rounded-xl border text-center font-semibold text-xs transition-all ${
                  size === s
                    ? 'border-white bg-white text-zinc-950 shadow-md'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 text-zinc-300'
                } ${isSold ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div>{s}</div>
                <div className={`text-[10px] ${size === s ? 'text-zinc-600' : 'text-zinc-500'} mt-0.5`}>
                  {multiplierStr}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Cantidad y Precios */}
      <div className="border-t border-zinc-800/80 pt-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-[10px] text-zinc-500 block font-semibold uppercase tracking-wider">VALOR TOTAL</span>
            <span className="text-2xl font-bold text-white tracking-tight">
              ${(finalPrice * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/80 h-10">
            <button
              type="button"
              disabled={quantity <= 1 || isSold}
              onClick={() => setQuantity((q) => q - 1)}
              className="px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold h-full transition-colors disabled:opacity-40"
            >
              -
            </button>
            <span className="px-4 text-sm font-semibold text-zinc-100">{quantity}</span>
            <button
              type="button"
              disabled={isSold}
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold h-full transition-colors disabled:opacity-40"
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
          className={`w-full py-3.5 px-4 rounded-xl font-semibold text-center flex justify-center items-center gap-2 shadow-lg transition-all text-sm ${
            isSold
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none border border-zinc-700/60'
              : 'bg-white hover:bg-zinc-200 text-zinc-950 active:scale-[0.98]'
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
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-2">
            <i className="bi bi-check-circle-fill"></i>
            ¡Obra configurada añadida a su carrito!
          </div>
        )}
      </div>
    </div>
  )
}
